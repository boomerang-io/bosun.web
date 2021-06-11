import React from "react";
import Graph from "./Graph";
import Info from "./Info";
import { getLineChartData } from "./helpers/formatLineChartData";
import { PolicyData, InsightsData, Violation, Info as InfoProps, ChartsData } from "Types";
import styles from "./insights.module.scss";

type Props = {
  insights: InsightsData[];
  policies: PolicyData[];
  violations: Violation[];
};

function Insights({ insights, violations, policies }: Props) {
  const formatedData: ChartsData = getLineChartData(insights);
  let gatesCount = 0;

  const gatesData: InfoProps = {
    type: "gates",
    title: "Current Gates",
    content: "Software never is perfect and it won’t be. But is that a license to create garbage?",
    count: policies.reduce((acc, policy) => (gatesCount += policy.stages?.length ?? 0), 0),
  };
  const violationsData: InfoProps = {
    type: "violations",
    title: "Current Violations",
    content: "Code will set you free. Think of this as an opportunity for better code. Drive towards zero.",
    count: violations.reduce((acc, violation) => (acc += violation?.nbrViolations ?? 0), 0),
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Insights</h2>
      <div className={styles.contentContainer}>
        <div className={styles.tilesContainer}>
          <Info info={gatesData} />
          <Info info={violationsData} />
        </div>
        <div className={styles.graphsContainer}>
          <Graph formatedData={formatedData} />
        </div>
      </div>
    </section>
  );
}

export default Insights;
