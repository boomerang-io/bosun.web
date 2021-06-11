import React, { useState } from "react";
import {
  Button,
  CodeSnippet,
  ComposedModal,
  ConfirmModal,
  FeatureHeader,
  FeatureHeaderTitle,
  ModalForm,
  ModalFooter,
  ModalBody,
  OrderedList,
  ListItem,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { formatDateTimeString } from "Utils";
import { PRODUCT_SERVICE_ENV_URL } from "Config/servicesConfig";
import copy from "copy-to-clipboard";
import { Add16, TrashCan16, Save16 } from "@carbon/icons-react";
import { POLICY_INTERACTION_TYPES } from "Constants/";
import { PolicyData, ValidateInfo } from "Types";
import styles from "./createEditPolicyHeader.module.scss";

const ACTION_TYPE_CONFIG = {
  [POLICY_INTERACTION_TYPES.CREATE]: {
    title: "Create",
    affirmativeActionVerb: "Create",
    isPerformingActionVerb: "Creating...",
    icon: Add16,
  },
  [POLICY_INTERACTION_TYPES.EDIT]: {
    title: "Edit",
    affirmativeActionVerb: "Save",
    isPerformingActionVerb: "Saving...",
    deleteActionVerb: "Delete",
    isDeletingActionVerb: "Deleting...",
    icon: Save16,
  },
};

const defaultPolicy = {
  id: "",
  createdDate: "",
  name: "",
  teamId: "",
  definitions: [],
  stages:[],
};

type Props = {
    form: any;
    policy?: PolicyData;
    navigateBack: (...args: any[]) => void;
    type: string; // TODO: PropTypes.oneOf(Object.values(POLICY_INTERACTION_TYPES))
    isLoading?: boolean;
    validateInfo?: ValidateInfo;
    hasError: boolean;
};

function CreateEditPolicyHeader({ form, policy = defaultPolicy, navigateBack, type, validateInfo, isLoading = false, hasError: hasFetchError }: Props) {
  const config = ACTION_TYPE_CONFIG[type];
  const { name, errors, isPerformingAffirmativeAction, isDeleting, onCancel } = form;
  const hasErrors = Object.values(errors).filter(Boolean).length;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOnCancel = () => {
    if ((isPerformingAffirmativeAction || isDeleting) && onCancel) onCancel();
    else navigateBack();
  };

  return (
    <FeatureHeader
      includeBorder={false}
      style={{ top: "3rem" }}
      isLoading={isLoading}
      header={
        <>
          <FeatureHeaderTitle>{`${config.title} Policy`}</FeatureHeaderTitle>
          {policy.createdDate && !hasFetchError && (
            <div className={styles.metadataContainer}>
              <p className={styles.metadata}>
                <span className={styles.metaDataLabel}>Created: </span>{" "}
                <time>{formatDateTimeString(policy.createdDate)}</time>
              </p>
              {type === POLICY_INTERACTION_TYPES.EDIT && (
                <button className={styles.validationInfoButton} onClick={() => setIsDetailsModalOpen(true)}>
                  How do I use this?
                </button>
              )}
            </div>
          )}
        </>
      }
      actions={
        <section className={styles.buttons}>
          <Button className={styles.button} kind="secondary" onClick={handleOnCancel} size="field">
            Cancel
          </Button>
          {type === POLICY_INTERACTION_TYPES.EDIT && policy.id && (
            <Button
              disabled={isPerformingAffirmativeAction || isDeleting || Boolean(hasFetchError) || isLoading}
              className={styles.button}
              onClick={() => setIsDeleteModalOpen(true)}
              kind="danger"
              renderIcon={TrashCan16}
              iconDescription="Delete"
              size="field"
            >
              {isDeleting ? config.isDeletingActionVerb : config.deleteActionVerb}
            </Button>
          )}
          <Button
            data-testid="policy-header-affirmative-action"
            disabled={isPerformingAffirmativeAction || isDeleting || !name || Boolean(hasErrors)}
            className={styles.button}
            iconDescription={config.title}
            onClick={form.affirmativeAction}
            renderIcon={config.icon}
            type="submit"
            size="field"
          >
            {isPerformingAffirmativeAction ? config.isPerformingActionVerb : config.affirmativeActionVerb}
          </Button>
        </section>
      }
    >
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen
          title={`Delete ${policy.name}?`}
          negativeText="No"
          affirmativeText="Yes"
          onCloseModal={() => {
            setIsDeleteModalOpen(false);
          }}
          affirmativeButtonProps={{ kind: "danger" }}
          affirmativeAction={() => {
            form.deletePolicy();
            setIsDeleteModalOpen(false);
          }}
        />
      )}
      {type === POLICY_INTERACTION_TYPES.EDIT && (
        <ComposedModal
          isOpen={isDetailsModalOpen}
          composedModalProps={{ shouldCloseOnOverlayClick: true }}
          onCloseModal={() => setIsDetailsModalOpen(false)}
          modalHeaderProps={{ title: "Validation Guide", subtitle: "How to use this policy" }}
        >
          {() => (
            <ModalForm>
              <ModalBody>
                <h2 className={styles.modalSectionTitle}>Validation Endpoint</h2>
                <p>{`${PRODUCT_SERVICE_ENV_URL}/policy/validate`}</p>
                <h2 className={styles.modalSectionTitle}>Sample Payload</h2>
                <CodeSnippet
                  copyButtonDescription="Copy annotations to clipboard"
                  onClick={() => copy(JSON.stringify(validateInfo))}
                  type="multi"
                >
                  {JSON.stringify(validateInfo, null, 1)}
                </CodeSnippet>
                <h2 className={styles.modalSectionTitle}>Next Steps (things to adjust)</h2>
                <OrderedList className={styles.orderedList}>
                  <ListItem>
                    Update <code>ReferenceId</code> to a unique identifier to ensure you can track specific xyz
                  </ListItem>
                  <ListItem>
                    Update <code>ReferenceLink</code> a link back to xyz
                  </ListItem>
                  <ListItem>
                    Supply{" "}
                    <a href="https://github.com/boomerang-io/boomerang.docs/blob/stable/content/bosun.md#labels-required">
                      labels
                    </a>{" "}
                    that can be used by the integrations to integrate and retrieve backend information
                  </ListItem>
                  <ListItem>Call the validation endpoint with the updated data</ListItem>
                </OrderedList>
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
              </ModalFooter>
            </ModalForm>
          )}
        </ComposedModal>
      )}
    </FeatureHeader>
  );
}

export default CreateEditPolicyHeader;
