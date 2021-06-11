import React from "react";
import { ConfirmModal } from "@boomerang-io/carbon-addons-boomerang-react";
import TemplateRulesModal from "./TemplateRulesModal";
import CloseButton from "Components/CloseButton";
import { PolicyInput } from "Types";
import styles from "./templateRules.module.scss";

function RulePropertyRow({
  title,
  value
}: {title: string; value: string;}) {
  return (
    <dl className={styles.fieldContainer}>
      <dt className={styles.fieldKey}>{title}</dt>
      <dd className={styles.fieldValue}>{value}</dd>
    </dl>
  );
}

function RulePropertyHeader({
  label,
  description
}: {label: string; description: string;}) {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.label}>{label}</h1>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

function formatDefaultValue(value: string | undefined) {
  if (!value) {
    return "---";
  }
  return value;
}

type TemplateRulesProps = {
    arrayHelpers: any;
    inputsKeys?: string[];
    rules?: PolicyInput[];
};

export default function TemplateRules({ arrayHelpers, rules = [], inputsKeys = [] }: TemplateRulesProps) {
  return (
    <div className={styles.propertyList}>
      {rules.length > 0 &&
        rules.map((input, index) => (
          <section key={`${input.id}-${index}`} className={styles.property}>
            <RulePropertyHeader label={input.label} description={input.description} />
            <RulePropertyRow title="Key" value={input.key} />
            <RulePropertyRow title="Type" value={input.type} />
            <RulePropertyRow title="Default value" value={formatDefaultValue(input.defaultValue)} />
            <RulePropertyRow title="Options" value={formatDefaultValue(input.options?.join(", "))} />
            <TemplateRulesModal
              isEdit
              inputsKeys={inputsKeys.filter((inputName: any) => inputName !== input.key)}
              input={input}
              updateConfig={(values: any) => arrayHelpers.replace(index, values)}
            />
            <ConfirmModal
              affirmativeAction={() => {
                arrayHelpers.remove(index);
              }}
              affirmativeButtonProps={{ kind: "danger" }}
              children="It will be gone once you save."
              title="Delete This Property?"
              modalTrigger={({
                openModal
              }: any) => <CloseButton className={styles.deleteProperty} onClick={openModal} />}
            />
          </section>
        ))}
      <TemplateRulesModal isEdit={false} inputsKeys={inputsKeys} createConfig={arrayHelpers.push} />
    </div>
  );
}
