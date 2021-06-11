import React, { useState } from "react";
import { Button, ConfirmModal, FeatureHeader, FeatureHeaderTitle } from "@boomerang-io/carbon-addons-boomerang-react";
import { formatDateTimeString } from "Utils";
import { Add16, TrashCan16, Save16 } from "@carbon/icons-react";
import { TEMPLATE_INTERACTION_TYPES } from "Constants/";
import { PolicyDefinitionTemplate } from "Types";
import styles from "./createEditPolicyHeader.module.scss";

const ACTION_TYPE_CONFIG = {
  [TEMPLATE_INTERACTION_TYPES.CREATE]: {
    title: "Create",
    affirmativeActionVerb: "Create",
    isPerformingActionVerb: "Creating...",
    icon: Add16,
  },
  [TEMPLATE_INTERACTION_TYPES.EDIT]: {
    title: "Edit",
    affirmativeActionVerb: "Save",
    isPerformingActionVerb: "Saving...",
    deleteActionVerb: "Delete",
    isDeletingActionVerb: "Deleting...",
    icon: Save16,
  },
};

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
    form?: any;
    template?: PolicyDefinitionTemplate;
    navigateBack: (...args: any[]) => void;
    type?: any; // TODO: PropTypes.oneOf(Object.values(TEMPLATE_INTERACTION_TYPES))
    onCancel?: (...args: any[]) => void;
    isLoading?: boolean;
    hasError?: boolean; 
};

function CreateEditPolicyHeader({ form = { isSubmitting: false, isValid: false, affirmativeAction: null }, template = defaultTemplate, navigateBack, type, onCancel, isLoading = false, hasError = false }: Props) {
  const config = ACTION_TYPE_CONFIG[type];
  const { isSubmitting, isValid } = form;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const handleOnCancel = () => {
    if (isSubmitting && onCancel) onCancel();
    else navigateBack();
  };

  return (
    <FeatureHeader
      includeBorder={false}
      header={
        <>
          <FeatureHeaderTitle>{`${config.title} Template`}</FeatureHeaderTitle>
          {template.createdDate && (
            <div>
              <p className={styles.metaData}>
                <span className={styles.metaDataLabel}>Created: </span>
                {formatDateTimeString(template.createdDate)}
              </p>
            </div>
          )}
        </>
      }
      actions={
        <section className={styles.buttons}>
          <Button className={styles.button} kind="secondary" onClick={handleOnCancel} size="field">
            Cancel
          </Button>
          {type === TEMPLATE_INTERACTION_TYPES.EDIT && template.id && (
            <Button
              disabled={isSubmitting}
              className={styles.button}
              onClick={() => setDeleteModalIsOpen(true)}
              kind="danger"
              renderIcon={TrashCan16}
              iconDescription="Delete"
              size="field"
            >
              {isSubmitting ? config.isDeletingActionVerb : config.deleteActionVerb}
            </Button>
          )}
          <Button
            data-testid="policy-header-affirmative-action"
            disabled={isSubmitting || !isValid || isLoading || hasError}
            className={styles.button}
            iconDescription={config.title}
            onClick={form.affirmativeAction}
            renderIcon={config.icon}
            type="submit"
            size="field"
          >
            {isSubmitting ? config.isPerformingActionVerb : config.affirmativeActionVerb}
          </Button>
        </section>
      }
    >
      {deleteModalIsOpen && (
        <ConfirmModal
          isOpen
          title={`Delete ${template.name}?`}
          negativeText="No"
          affirmativeText="Yes"
          onCloseModal={() => {
            setDeleteModalIsOpen(false);
          }}
          affirmativeButtonProps={{ kind: "danger" }}
          affirmativeAction={() => {
            form.deletePolicy();
            setDeleteModalIsOpen(false);
          }}
        />
      )}
    </FeatureHeader>
  );
}

export default CreateEditPolicyHeader;
