import React from "react";
import NoDisplay from "Components/NoDisplay";
import { Button } from "@boomerang-io/carbon-addons-boomerang-react";
import { useHistory } from "react-router-dom";
import PoliciesTable from "./PoliciesTable";
import { appLink } from "Config/appConfig";
import { Add16 } from "@carbon/icons-react";
import { PolicyData } from "Types";
import styles from "./policies.module.scss";

type Props = {
  policies: PolicyData[];
  activeTeamId?: string;
};

export function Policies({ policies, activeTeamId }: Props) {
  let history = useHistory();
  return (
    <section className={styles.container} data-testid="policies-container" id="policies-container">
      <h2 className={styles.title}>{`Policies (${policies.length})`}</h2>
      <p className={styles.message}>
        All of your teams policies can be found here. Go forth and define rules to enforce your standards!
      </p>
      <div className={styles.button}>
        <Button
          data-testid="add-policy-button"
          iconDescription="Create Policy"
          onClick={() => history.push(appLink.createPolicy({ teamId: activeTeamId }))}
          renderIcon={Add16}
          size="field"
        >
          Create Policy
        </Button>
      </div>
      {policies.length > 0 ? (
        <PoliciesTable policies={policies} />
      ) : (
        <NoDisplay text="No policies found. Go forth and create one or two why don't you?" style={{ width: "20rem" }} />
      )}
    </section>
  );
}

export default Policies;
