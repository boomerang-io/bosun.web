import React from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useQuery, useMutation, queryCache } from "react-query";
import { Helmet } from "react-helmet";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditTemplateForm from "Components/CreateEditTemplateForm";
import NoDisplay from "Components/NoDisplay";
import { TEMPLATE_INTERACTION_TYPES } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { PolicyDefinitionTemplate } from "Types";

function EditTemplate() {
  const history = useHistory();
  function navigateBack() {
    history.push(appLink.policyTemplates());
  }
  const cancelRequestRef = React.useRef<any>();

  function getTakenNamesAndKeys() {
    const templateNames: any = [];
    const templateKeys: any = [];
    templatesData?.forEach((template: any) => {
      if (template.id !== templateId) {
        templateNames.push(template.name);
        templateKeys.push(template.key);
      }
    });

    return { templateNames, templateKeys };
  }

  const { templateId } = useParams();

  const getTemplatesUrl = serviceUrl.getTemplates();
  const { data: templatesData, isLoading, error } = useQuery<PolicyDefinitionTemplate[]>({
    queryKey: getTemplatesUrl,
    queryFn: resolver.query(getTemplatesUrl),
  });

  const [updatePolicyTemplateMutation] = useMutation(
    (args: { templateId: string; body: PolicyDefinitionTemplate }) => {
      const { promise, cancel } = resolver.patchUpdatePolicyTemplate(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTemplates()),
    }
  );

  async function updateTemplate(values: any) {
    const valuesToSave = { ...values, rego: btoa(values.rego), id: templateId };
    try {
      await updatePolicyTemplateMutation({ templateId, body: valuesToSave });
      notify(
        <ToastNotification kind="success" title="Template Updated" subtitle="Template was successfully updated" />
      );
      navigateBack();
    } catch (e) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to update template failed" />);
    }

    return false;
  }
  const template = templatesData?.find((template: PolicyDefinitionTemplate) => template.id === templateId);

  if (template) {
    const validationData = getTakenNamesAndKeys();

    return (
      <>
        <Helmet>
          <title>{`${template.name} - Bosun Policy Templates`}</title>
        </Helmet>
        <CreateEditTemplateForm
          onSubmit={updateTemplate}
          navigateBack={navigateBack}
          template={template}
          validationData={validationData}
          type={TEMPLATE_INTERACTION_TYPES.EDIT}
          onCancel={cancelRequestRef.current}
          isLoading={isLoading}
          hasError={Boolean(error)}
        />
      </>
    );
  } else if (templatesData) {
    return (
      <div style={{ textAlign: "center" }}>
        <NoDisplay
          text="No matching template found. Are you sure you have the right link?"
          style={{ width: "30rem", marginTop: "10rem" }}
        />
        <Link to={appLink.policyTemplates()}>Go to Templates</Link>
      </div>
    );
  }
  return null;
}

export default EditTemplate;
