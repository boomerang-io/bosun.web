import React, { useState } from "react";
import { useAppContext } from "Hooks";
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
import { PolicyDefinition, CreatePolicyData, PolicyDefinitionTemplate } from "Types";
import styles from "./createPolicy.module.scss";

type Props = {
  history: any;
  match: any;
};

export function CreatePolicy({ history, match }: Props) {
  const { activeTeam } = useAppContext();

  const definitionsUrl = serviceUrl.getTemplates();
  const { params } = match;

  const [errors, setErrors] = useState<any>({});
  const [inputs, setInputs] = useState<any>({});
  const [name, setName] = useState("");
  const cancelRequestRef = React.useRef<any>();

  const { data: definitionsData, isLoading, error } = useQuery<Array<PolicyDefinitionTemplate>, any>({
    queryKey: definitionsUrl,
    queryFn: resolver.query(definitionsUrl),
  });

  const [createPolicyMutation, { isLoading: createIsLoading }] = useMutation(
    (args: { body: CreatePolicyData }) => {
      const { promise, cancel } = resolver.postCreatePolicy(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(definitionsUrl),
    }
  );
  const createPolicy = async () => {
    let policyObject: CreatePolicyData = {
      name: name,
      teamId: activeTeam?.id ?? "",
      definitions: [],
    };

    definitionsData?.forEach((definition: PolicyDefinitionTemplate) => {
      let newDefinition: PolicyDefinition = {
        policyTemplateId: definition.id,
        rules: [],
      };
      let rules = [];
      const definitionRows = inputs[definition.key];
      for (let row in definitionRows) {
        rules.push(definitionRows[row]);
      }
      newDefinition["rules"] = rules;
      policyObject.definitions.push(newDefinition);
    });

    try {
      await createPolicyMutation({ body: policyObject });
      notify(<ToastNotification kind="success" title="Policy Created" subtitle="Policy was successfully created" />);
      navigateBack();
    } catch (e) {
      notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to create policy failed" />);
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
    let definitionRows = { ...inputs[definitionKey] };
    if (definitionRows) {
      delete definitionRows[uuid];
      await setInputs((prevState: any) => ({
        ...prevState,
        [definitionKey]: definitionRows,
      }));
      validateRow(definitionKey);
    }
  };

  const validateRow = (definitionKey: any) => {
    const definitionRows = inputs[definitionKey] || {};
    const definitionRowsInputCount = Object.keys(definitionRows).reduce((accum, uuid) => {
      const inputCount = Object.values(definitionRows[uuid]).filter(Boolean).length;
      accum += inputCount;
      return accum;
    }, 0);

    // Each row should have the same number of inputs as the number of inputs in the policy definition rules
    const matchingDefintion = definitionsData?.find((definition: any) => definition.key === definitionKey);
    const isInvalid =
      matchingDefintion &&
      Object.keys(definitionRows).length * matchingDefintion.rules.length !== definitionRowsInputCount;
    setErrors((prevState: any) => ({ ...prevState, [definitionKey]: isInvalid }));
  };

  // Local methods

  const navigateBack = () => {
    history.push(appLink.teamOverview({ teamId: params.teamId }));
  };

  const form = {
    name,
    inputs,
    errors,
    setName,
    setInput: setInput,
    setError: setError,
    removeRow,
    validateRow,
    onCancel: cancelRequestRef.current,
    affirmativeAction: createPolicy,
    isPerformingAffirmativeAction: createIsLoading,
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Create Policy - Bosun Policies</title>
      </Helmet>
      <CreateEditPolicyHeader
        form={form}
        navigateBack={navigateBack}
        type={POLICY_INTERACTION_TYPES.CREATE}
        hasError={Boolean(error)}
      />
      {isLoading ? (
        <div className={styles.skeletonsContainer}>
          <TextInputSkeleton className={styles.textInputSkeleton} />
          <DefinitionSkeleton />
          <DefinitionSkeleton />
          <DefinitionSkeleton />
        </div>
      ) : error ? (
        <div style={{ marginTop: "2rem" }}>
          <ErrorMessage />
        </div>
      ) : (
        <CreateEditPolicyForm form={form} definitions={definitionsData ?? []} />
      )}
    </div>
  );
}

export default CreatePolicy;
