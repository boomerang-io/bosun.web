import React, { useCallback, useState, useEffect } from "react";
import uuid from "uuid";
import { useQuery, useMutation, queryCache } from "react-query";
import { Helmet } from "react-helmet";
import {
  notify,
  ToastNotification,
  ErrorMessage,
  TextInputSkeleton,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditPolicyForm from "Components/CreateEditPolicyForm";
import CreateEditPolicyHeader from "Components/CreateEditPolicyHeader";
import DefinitionSkeleton from "Components/DefinitionSkeleton";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { POLICY_INTERACTION_TYPES } from "Constants";
import {
  PolicyDefinitionTemplate,
  PolicyDefinition,
  EditPolicyData,
  ObjectOfStringKeyObject,
  PolicyData,
  ValidateInfo,
  StringKeyObject,
} from "Types";
import styles from "./editPolicy.module.scss";

const defaultTemplate = {
  id: "",
  key: "",
  createdDate: "",
  name: "",
  description: "",
  order: 0,
  rego: "",
  labels: [],
  rules: [],
};

type Props = {
  history: any;
  match: any;
};

function EditPolicy({ history, match }: Props) {
  const [inputs, setInputs] = useState<ObjectOfStringKeyObject>();
  const [errors, setErrors] = useState({});
  const [name, setName] = useState<string>("");
  const cancelRequestRef = React.useRef<any>();

  const definitionsUrl = serviceUrl.getTemplates();
  const policyUrl = serviceUrl.getPolicy({ policyId: match.params.policyId });
  const validateInfoUrl = serviceUrl.getValidateInfo({ policyId: match.params.policyId });

  const { data: definitionsData, isLoading: definitionsIsLoading, error: definitionsError } = useQuery<
    Array<PolicyDefinitionTemplate>,
    any
  >({
    queryKey: definitionsUrl,
    queryFn: resolver.query(definitionsUrl),
  });
  const { data: policyData, isLoading: policyIsLoading, error: policyError } = useQuery<PolicyData, any>({
    queryKey: policyUrl,
    queryFn: resolver.query(policyUrl),
    config: { onSuccess: (data: PolicyData) => setName(data.name) },
  });
  const { data: validateInfoData, isLoading: validateInfoIsLoading, error: validateInfoError } = useQuery<
    ValidateInfo,
    any
  >({
    queryKey: validateInfoUrl,
    queryFn: resolver.query(validateInfoUrl),
  });

  /**
   * Transform the policy object into shape that can be read by the child form
   * @param {object} policy - policy to read in and create input state from
   * @param {array} definitionsData - definitionsData referenced in policy
   * @returns {object} - new state object for "inputs" key
   */
  const formatPolicyDataForForm = useCallback((policyData: PolicyData, definitionsData: PolicyDefinitionTemplate[]) => {
    const newInputsState: ObjectOfStringKeyObject = {};
    policyData.definitions.forEach((definition: any) => {
      const policyDefinition: PolicyDefinitionTemplate =
        definitionsData.find(
          (policyDefinition: PolicyDefinitionTemplate) => policyDefinition.id === definition.policyTemplateId
        ) ?? defaultTemplate;
      newInputsState[policyDefinition.key] = {};
      const definitionRows: StringKeyObject = newInputsState[policyDefinition.key];
      definition.rules.forEach((rule: any) => {
        definitionRows[uuid.v4()] = rule;
      });
    });
    return newInputsState;
  }, []);

  useEffect(() => {
    if (policyData && definitionsData) {
      setInputs(formatPolicyDataForForm(policyData, definitionsData));
    }
  }, [formatPolicyDataForForm, policyData, definitionsData]);

  const [updatePolicyMutation, { isLoading: isUpdating }] = useMutation(
    (args: { body: EditPolicyData; policyId: string }) => {
      const { promise, cancel } = resolver.patchUpdatePolicy(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(definitionsUrl),
    }
  );

  const [deletePolicyMutation, { isLoading: isDeleting }] = useMutation(
    (args: { policyId: string }) => {
      const { promise, cancel } = resolver.deletePolicy(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(definitionsUrl),
    }
  );

  const updatePolicy = async () => {
    let policyObject: EditPolicyData = {
      id: policyData?.id ?? "",
      name: name,
      teamId: policyData?.teamId ?? "",
      definitions: [],
    };

    definitionsData?.forEach((definition: PolicyDefinitionTemplate) => {
      let newDefinition: PolicyDefinition = {
        policyTemplateId: definition.id,
        rules: [],
      };
      let rules: any[] = [];
      const definitionRows = inputs && inputs[definition.key];
      for (let row in definitionRows) {
        Boolean(definitionRows[row]) && rules.push(definitionRows[row]);
      }
      newDefinition["rules"] = rules;
      policyObject.definitions.push(newDefinition);
    });

    try {
      await updatePolicyMutation({ body: policyObject, policyId: policyData?.id ?? "" });
      notify(<ToastNotification kind="success" title="Policy Updated" subtitle="Policy successfully updated" />);
      navigateBack();
    } catch (e) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to update policy failed" />);
    }
  };

  const deletePolicy = async () => {
    try {
      await deletePolicyMutation({ policyId: policyData?.id ?? "" });
      notify(
        <ToastNotification
          kind="success"
          title="Policy Deleted"
          subtitle={`Policy ${policyData?.name} successfully deleted`}
        />
      );
      navigateBack();
    } catch (err) {
      const { data } = err && err.response;
      notify(<ToastNotification kind="error" title={`${data.status} - ${data.error}`} subtitle={data.message} />, {
        autoClose: 5000,
      });
    }
  };

  // State updates
  const setError = (error: any) => {
    setErrors((prevState: any) => ({ ...prevState, ...error }));
  };

  const setInput = async ({ event: e, definitionKey, uuid }: any) => {
    const { name, value } = e.target;
    await setInputs((prevState: any) => {
      const prevStateDefinitionRows = prevState[definitionKey] ? prevState[definitionKey][uuid] : {};
      return {
        ...prevState,
        [definitionKey]: {
          ...prevState[definitionKey],
          [uuid]: { ...prevStateDefinitionRows, [name]: value },
        },
      };
    });
    validateRow(definitionKey);
  };

  const removeRow = async ({ definitionKey, uuid }: any) => {
    let definitionRows = inputs && { ...inputs[definitionKey] };
    if (definitionRows) {
      delete definitionRows[uuid];
      await setInputs((prevState: any) => ({
        ...prevState,
        [definitionKey]: definitionRows,
      }));
      validateRow(definitionKey);
    }
  };

  /**
   *
   * @param {definitionKey} - key reference to a definition type e.g. static_code_analysis
   */
  const validateRow = (definitionKey: string) => {
    const definitionRows = (inputs && inputs[definitionKey]) || {};
    const definitionRowsInputCount = Object.keys(definitionRows).reduce((accum, uuid) => {
      const inputCount = Object.values(definitionRows[uuid] ?? []).filter(Boolean).length;
      accum += inputCount;
      return accum;
    }, 0);

    // Each row should have the same number of inputs as the number of inputs in the policy definition rules
    const matchingDefintion = definitionsData?.find(
      (definition: PolicyDefinitionTemplate) => definition.key === definitionKey
    );
    const isInvalid =
      matchingDefintion &&
      Object.keys(definitionRows).length * matchingDefintion.rules.length !== definitionRowsInputCount;
    setErrors((prevState) => ({ ...prevState, [definitionKey]: isInvalid }));
  };

  useEffect(() => {
    return function cleanup() {
      queryCache.removeQueries(policyUrl, { exact: true });
    };
  }, [policyUrl]);
  // Local methods

  const navigateBack = () => {
    history.push(appLink.teamOverview({ teamId: match.params.teamId }));
  };
  const hasError = definitionsError || policyError || validateInfoError;
  const isLoading = definitionsIsLoading || policyIsLoading || validateInfoIsLoading;

  const form = {
    name,
    inputs,
    errors,
    setName,
    setInput,
    setError,
    removeRow,
    validateRow,
    onCancel: cancelRequestRef.current,
    affirmativeAction: updatePolicy,
    deletePolicy,
    isPerformingAffirmativeAction: isUpdating,
    isDeleting,
  };

  const helmetTitle = policyData?.name ? `${policyData.name} - ` : "";
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{`${helmetTitle}Bosun Policies`}</title>
      </Helmet>
      <CreateEditPolicyHeader
        form={form}
        navigateBack={navigateBack}
        policy={policyData}
        type={POLICY_INTERACTION_TYPES.EDIT}
        validateInfo={validateInfoData}
        isLoading={isLoading}
        hasError={hasError}
      />
      {isLoading ? (
        <div className={styles.skeletonsContainer}>
          <TextInputSkeleton className={styles.textInputSkeleton} />
          <DefinitionSkeleton />
          <DefinitionSkeleton />
          <DefinitionSkeleton />
        </div>
      ) : hasError ? (
        <div style={{ marginTop: "2rem" }}>
          <ErrorMessage />
        </div>
      ) : (
        <CreateEditPolicyForm form={form} definitions={definitionsData ?? []} />
      )}
    </div>
  );
}

export default EditPolicy;
