import React, { useState } from "react";
import { ComboBox, TextInput, TextArea, Button } from "@boomerang-io/carbon-addons-boomerang-react";
import uuid from "uuid";
import { Add16, TrashCan16 } from "@carbon/icons-react";
import { PolicyInput, PolicyDefinitionTemplate, StringKeyObject } from "Types";
import styles from "./policyFormDefinitionSection.module.scss";

interface InputTypes { [key: string]: {type: string} };

const INPUT_TYPES:InputTypes = {
  text: { type: "text" },
  password: { type: "password" },
  number: { type: "number" },
  url: { type: "url" },
  email: { type: "email" },
};

const TEXT_AREA_TYPES = {
  textarea: { type: "textarea" },
};

const SELECT_TYPES = {
  select: { type: "select", isMultiselect: false, valueProperty: "value" },
  multiselect: { type: "multiselect", isMultiselect: true, valueProperty: "values" },
};

type InputProps = {
  uuid?: string;
  inputData: PolicyInput;
  inputs: StringKeyObject;
  onChange: (...args: any[]) => void;
};

function determineInput({
  onChange,
  inputs,
  inputData,
  uuid
}: InputProps) {
  const { type, label, key, required, options } = inputData;
  if (Object.keys(INPUT_TYPES).includes(type)) {
    const config = INPUT_TYPES[type];

    return (
      <TextInput
        autoComplete="off"
        id={`${key}-${uuid}`}
        key={key}
        labelText={label}
        name={key}
        onChange={(e: any) => onChange(e, uuid)}
        required={required}
        type={config.type}
        value={inputs[key]}
      />
    );
  }

  if (Object.keys(TEXT_AREA_TYPES).includes(type)) {
    return (
      <TextArea
        autoComplete="off"
        id={`${key}-${uuid}`}
        key={key}
        labelText={label}
        name={key}
        onChange={(e: any) => onChange(e, uuid)}
        required={required}
        value={inputs[key]}
      />
    );
  }

  if (Object.keys(SELECT_TYPES).includes(type)) {
    return (
      <ComboBox
        autoComplete="off"
        id={`${key}-${uuid}`}
        key={key}
        titleText={label}
        initialSelectedItem={inputs[key]}
        items={options}
        onChange={({
          selectedItem
        }: any) => onChange({ target: { name: key, value: selectedItem } }, uuid)}
        required={required}
        type="text"
      />
    );
  }

  return null;
}

function determineInitialState(definition: PolicyDefinitionTemplate, inputs: StringKeyObject) {
  let initialRowsState = [];
  for (let row in inputs) {
    initialRowsState.push({ rules: definition.rules, uuid: row });
  }

  return initialRowsState;
}

type Props = {
  definition: PolicyDefinitionTemplate;
  form: any;
}

function PolicyFormDefinitionSection({
  definition,
  form
}: Props) {
  const inputs = form?.inputs?.[definition.key] || {};
  const [rows, setRows] = useState<Array<any>>(determineInitialState(definition, inputs));

  function addRow() {
    const newRows = [...rows, { rules: definition.rules, uuid: uuid.v4() }];
    setRows(newRows);
    form.validateRow(definition.key);
  }

  function removeRow(index: number) {
    const rowToRemove = rows[index];
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
    form.removeRow({ definitionKey: definition.key, uuid: rowToRemove.uuid });
  }

  function onChange(e: any, uuid: string) {
    form.setInput({ event: e, definitionKey: definition.key, uuid: uuid });
  }

  return (
    <section className={styles.section}>
      <h2>{definition.name}</h2>
      <p>{definition.description}</p>
      <div className={styles.rowsContainer}>
        {rows.map((row, index) => {
          return (
            <div className={styles.row} key={row.uuid}>
              {row.rules?.map((input: any) => determineInput({
                onChange,
                inputs: inputs[row.uuid] || {},
                inputData: input,
                uuid: row.uuid,
              })
              ) ?? <p>No rules found. Check the policy template.</p>}
              <button className={styles.delete} onClick={() => removeRow(index)}>
                <TrashCan16 />
              </button>
            </div>
          );
        })}
      </div>
      <Button
        kind="ghost"
        iconDescription={"Add Rule"}
        onClick={addRow}
        renderIcon={Add16}
        size="field"
        style={{ marginLeft: "-0.625rem" }}
      >
        Add Rule
      </Button>
    </section>
  );
}

export default PolicyFormDefinitionSection;
