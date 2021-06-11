import React from "react";
import { useMutation, queryCache } from "react-query";
import { Helmet } from "react-helmet";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditTemplateForm from "Components/CreateEditTemplateForm";
import { TEMPLATE_INTERACTION_TYPES } from "Constants";
import { appLink } from "Config/appConfig";
import { PolicyDefinitionTemplate } from "Types";
import { resolver, serviceUrl } from "Config/servicesConfig";

function CreateTemplate(props: any) {
  function navigateBack() {
    props.history.push(appLink.policyTemplates());
  }
  const cancelRequestRef = React.useRef<any>();

  const [createPolicyTemplateMutation] = useMutation(
    (args: { body: PolicyDefinitionTemplate }) => {
      const { promise, cancel } = resolver.postCreatePolicyTemplate(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTemplates()),
    }
  );

  async function createTemplate(values: PolicyDefinitionTemplate) {
    const valuesToSave: PolicyDefinitionTemplate = { ...values, rego: btoa(values.rego) };
    try {
      await createPolicyTemplateMutation({ body: valuesToSave });
      notify(
        <ToastNotification kind="success" title="Template Created" subtitle="Template was successfully created" />
      );
      navigateBack();
    } catch (e) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to create template failed" />);
    }

    return false;
  }

  return (
    <>
      <Helmet>
        <title>Create Template - Bosun Policy Templates</title>
      </Helmet>
      <CreateEditTemplateForm
        navigateBack={navigateBack}
        onSubmit={createTemplate}
        type={TEMPLATE_INTERACTION_TYPES.CREATE}
        onCancel={cancelRequestRef.current}
      />
    </>
  );
}

export default CreateTemplate;
