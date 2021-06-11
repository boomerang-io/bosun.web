import React, { Component } from "react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import TemplateRulesModalContent from "./TemplateRulesModalContent";
import EditButton from "Components/EditButton";
import { Add32 } from "@carbon/icons-react";
import { PolicyInput } from "Types";
import styles from "./templateRulesModal.module.scss";

type Props = {
    input?: PolicyInput;
    inputsKeys?: string[];
    isEdit: boolean;
    createConfig?: (...args: any[]) => void;
    updateConfig?: (...args: any[]) => void;
};
class WorkflowProperties extends Component<Props> {
    editTrigger = ({ openModal }: any) => {
        if (this.props.isEdit) {
            return (<EditButton className={styles.editContainer} onClick={openModal} aria-label="Edit" data-testid="edit-property-trigger"/>);
        }
        else {
            return (<button className={styles.createPropertyCard} onClick={openModal} data-testid="create-new-workflow-input-button" type="button">
          <div className={styles.createContainer}>
            <Add32 className={styles.createIcon} aria-label="Add"/>
            <p className={styles.createText}>Create a new rule</p>
          </div>
        </button>);
        }
    };
    render() {
        const { isEdit } = this.props;
        return (<ComposedModal modalHeaderProps={{
            title: isEdit ? "Update Rule" : "Create Rule",
            subtitle: isEdit ? "Let's update it" : "Let's create a new one",
        }} modalTrigger={this.editTrigger}>
        {({ closeModal }: any) => (<TemplateRulesModalContent createConfig={(this.props as any).createConfig} updateConfig={(this.props as any).updateConfig} closeModal={closeModal} {...this.props}/>)}
      </ComposedModal>);
    }
}
export default WorkflowProperties;
