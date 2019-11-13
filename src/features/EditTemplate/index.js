import React from "react";
import axios from "axios";
import { useParams, useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastNotification } from "carbon-components-react";
import useAxiosFetch from "utils/hooks/useAxios";
import CreateEditTemplateForm from "components/CreateEditTemplateForm";
import Loading from "components/Loading";
import NoDisplay from "components/NoDisplay";
import { TEMPLATE_INTERACTION_TYPES } from "../../constants";
import { SERVICE_PRODUCT_TEMPLATES_PATH } from "config/servicesConfig";

function EditTemplate(props) {
  const history = useHistory();
  function navigateBack() {
    history.push("/templates");
  }

  const { templateId } = useParams();
  //const [status, setStatus] = React.useState();

  const templatesState = useAxiosFetch(SERVICE_PRODUCT_TEMPLATES_PATH);

  async function updateTemplate(values) {
    //setStatus("pending");
    try {
      await axios.patch(SERVICE_PRODUCT_TEMPLATES_PATH, values);
      //setStatus("resolved");
      toast(
        <ToastNotification
          kind="success"
          title="Template Updated"
          subtitle="Template was successfully updated"
          caption=""
        />
      );
      navigateBack();
    } catch (e) {
      //setStatus("rejected");
      toast(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle="Request to update template failed"
          caption=""
        />
      );
    }

    return false;
  }
  if (templatesState.isLoading) {
    return <Loading centered />;
  }

  if (templatesState.data) {
    const template = templatesState.data.find(template => template.id === templateId);
    if (template) {
      console.log(template);
      return (
        <CreateEditTemplateForm
          onSubmit={updateTemplate}
          navigateBack={navigateBack}
          template={template}
          type={TEMPLATE_INTERACTION_TYPES.EDIT}
        />
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <NoDisplay
            text="No matching template found. Are you sure you have the right link?"
            style={{ width: "30rem", marginTop: "10rem" }}
          />
          <Link to="/templates">Go to Templates</Link>
        </div>
      );
    }
  }
  return null;
}

export default EditTemplate;