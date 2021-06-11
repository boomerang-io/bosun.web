import React from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Creatable, ErrorMessage, TextInput, TextArea, Tabs, Tab, SkeletonPlaceholder, TabsSkeleton } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditTemplateHeader from "Components/CreateEditTemplateHeader";
import TextEditor from "Components/TextEditor";
import ValidateFormikOnRender from "Components/ValidateFormikOnRender";
import TemplateRules from "./TemplateRules";
import { PolicyDefinitionTemplate } from "Types";
import styles from "./createTemplate.module.scss";

function validateKey(key: any) {
  const regexp = new RegExp("[^a-z|^A-Z|^0-9|^_|/.]");
  return !regexp.test(key);
}

type LayoutProps = {
  children: React.ReactNode,
  navigateBack: (...args: any[]) => void,
  type: string,
  onCancel?:(...args: any[]) => void,
  formikProps?: any,
  isLoading?: boolean;
  hasError?: boolean;
};

const FeatureLayout = ({
  children,
  navigateBack,
  type,
  onCancel,
  formikProps,
  isLoading,
  hasError
}: LayoutProps) => {
  return (
    <>
      <CreateEditTemplateHeader form={formikProps} navigateBack={navigateBack} type={type} onCancel={onCancel} isLoading={isLoading} hasError={hasError}/>
      {children}
    </>
  );
}

type Props = {
  navigateBack: (...args: any[]) => void;
  onSubmit: (...args: any[]) => void;
  template?: PolicyDefinitionTemplate;
  type: string;
  validationData?: {
    templateNames: string[];
    templateKeys: string[];
  },
  onCancel:(...args: any[]) => void;
  isLoading?: boolean;
  hasError?: boolean;
};

function CreateTemplate({
  navigateBack,
  onSubmit,
  template,
  type,
  validationData,
  onCancel,
  isLoading=false,
  hasError=false
}: Props) {
  const codeMirrorEditor = React.useRef(null);

  function setCodeMirroEditor(codeMirroEditor: any) {
    codeMirrorEditor.current = codeMirroEditor;
  }

  if(isLoading) {
    return (
      <FeatureLayout isLoading={true} navigateBack={navigateBack} type={type}>
        <div style={{padding: "2rem"}}>
          <TabsSkeleton className={styles.tabsSkeleton}/>
          <SkeletonPlaceholder className={styles.inputsSkeleton} />
        </div>
      </FeatureLayout>
    );
  }

  if(hasError) {
    return (
      <FeatureLayout hasError={true} navigateBack={navigateBack} type={type}>
        <div style={{padding: "2rem"}}>
          <ErrorMessage />
        </div>
      </FeatureLayout>
    );
  }

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        description: template?.description ?? "",
        key: template?.key ?? "",
        name: template?.name ?? "",
        order: template?.order ?? 0,
        rego: template?.rego ? atob(template.rego) : "",
        rules: template?.rules ?? [],
        // integration: template?.integration ?? "integrated",
        labels: template?.labels ?? [],
      }}
      validationSchema={Yup.object().shape({
        key: Yup.string()
          .required("Enter a key")
          .notOneOf(validationData?.templateKeys ?? [], "Enter a unique key value")
          .max(64, "Enter no more than 64 character")
          .test("is-valid-key", "Key cannot contain spaces and special characters", validateKey),
        description: Yup.string().max(250, "Enter 250 or less character"),
        name: Yup.string()
          .required("Enter a name")
          .notOneOf(validationData?.templateNames ?? [], "Enter a unique name")
          .max(64, "Enter no more than 64 character"),
        order: Yup.number().min(0, "Enter a positive number"),
        rego: Yup.string().required("Enter a Rego OPA policy"),
        rules: Yup.array().min(1, "Create at least one rule").max(20, "Really, more than 20 rules?"),
        labels: Yup.array().max(50, "Really, more than 50 labels?"),
      })}
    >
      {(formikProps) => {
        const {
          errors,
          values,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          validateForm,
        } = formikProps;
        return (
          <Form onSubmit={handleSubmit}>
            <FeatureLayout formikProps={formikProps} navigateBack={navigateBack} type={type} onCancel={onCancel}>
              <section className={styles.container}>
                <Tabs>
                  <Tab label="About">
                    <div className={styles.generalContainer}>
                      <section className={styles.generalSection}>
                        <h1 className={styles.sectionTitle}>General</h1>
                        <TextInput
                          id="name"
                          name="name"
                          key="name"
                          label="Name"
                          placeholder="Name"
                          invalid={errors.name && touched.name}
                          invalidText={errors.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                        />
                        <TextInput
                          id="key"
                          name="key"
                          key="key"
                          label="Key"
                          placeholder="Key"
                          helperText="Must match the OPA Rego package declaration"
                          invalid={errors.key && touched.key}
                          invalidText={errors.key}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.key}
                        />
                        <TextArea
                          id="description"
                          name="description"
                          key="description"
                          label="Description (optional)"
                          placeholder="Description"
                          invalid={errors.description && touched.description}
                          invalidText={errors.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.description}
                        />
                        <TextInput
                          id="order"
                          name="order"
                          type="number"
                          key="order"
                          label="Order (optional)"
                          placeholder="0"
                          helperText="Specify presentation order in Create Policy feature"
                          invalid={errors.order && touched.order}
                          invalidText={errors.order}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.order}
                        />
                      </section>
                      <section className={styles.generalSection}>
                        <h1 className={styles.sectionTitle}>Validation</h1>
                        {/* <Dropdown
                          id="integration"
                          titleText="Integration"
                          label="integration"
                          items={["integration", "custom"]}
                          onChange={({ selectedItem }) => setFieldValue("integration", selectedItem)}
                          selectedItem={values.integration}
                        /> */}
                        <Creatable
                          id="labels"
                          name="labels"
                          label="Labels (optional)"
                          helperText="Metadata to pass information into the pre-integrated repositories"
                          onChange={(values: any) => setFieldValue("labels", values)}
                          values={values.labels}
                          placeholder="Create labels"
                          type="text"
                          textInputProps={{ maxLength: 64 }}
                        />
                      </section>
                    </div>
                  </Tab>
                  <Tab label="Rules">
                    <p>Create at least one</p>
                    <FieldArray
                      name="rules"
                      render={(arrayHelpers) => <TemplateRules arrayHelpers={arrayHelpers} rules={values.rules} />}
                    />
                  </Tab>
                  <Tab 
                    label="OPA Rego"
                    //@ts-ignore
                    onClick={() => codeMirrorEditor.current.refresh()}
                  >
                    <section className={styles.opaPolicyContainer}>
                      <TextEditor
                        onChange={(value: any) => setFieldValue("rego", value)}
                        //@ts-ignore
                        setCodeMirroEditor={setCodeMirroEditor}
                        value={values.rego}
                      />
                    </section>
                  </Tab>
                </Tabs>
              </section>
              <ValidateFormikOnRender validateForm={validateForm} />
            </FeatureLayout>
          </Form>
        );
      }}
    </Formik>
  );
}

export default CreateTemplate;
