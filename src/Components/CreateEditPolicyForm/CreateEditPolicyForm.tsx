import React from "react";
import { TextInput } from "@boomerang-io/carbon-addons-boomerang-react";
import PolicyFormDefinitionSection from "./PolicyFormDefinitionSection";
import sortBy from "lodash/sortBy";
import KingJellyGraphic from "Components/KingJellyGraphic";
import { PolicyDefinitionTemplate } from "Types";
import styles from "./createEditPolicyForm.module.scss";

type Props = {
  definitions: PolicyDefinitionTemplate[];
  form: any;
};

export default function CreateEditPolicyForm({ definitions, form }: Props) {
  const sortedDefinitions = React.useMemo(() => sortBy(definitions, "order"), [definitions]);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <TextInput
          labelText="Name"
          name="name"
          id="name"
          onChange={(e: any) => form.setName(e.target.value)}
          placeholder="Name"
          value={form.name}
          type="text"
        />
        {sortedDefinitions.map((definition: PolicyDefinitionTemplate) => <PolicyFormDefinitionSection key={definition.id + definition.key} definition={definition} form={form} />)}
      </div>
      <div className={styles.containerGraphics}>
        <KingJellyGraphic className={styles.graphic} />
        {/* <ThanksRoosGraphic className={styles.graphic} /> */}
      </div>
    </div>
  );
}
