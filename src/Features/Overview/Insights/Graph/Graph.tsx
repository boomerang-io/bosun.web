import React, { Component } from "react";
import { Tile } from "@boomerang-io/carbon-addons-boomerang-react";
import LineChart from "./LineChart";
import { ChartsData } from "Types";
import styles from "./graph.module.scss";

type Props = {
  formatedData: ChartsData;
};

export class Graph extends Component<Props> {
  state = {
    fromDate: {},
    standard: {},
    toDate: {},
  };

  render() {
    const { formatedData } = this.props;
    return (
      <Tile
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "spaceBetween",
          minHeight: "10rem",
        }}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Violations Trend</h3>
          <div className={styles.filters}></div>
        </div>
        <div className={styles.container} data-testid="insights-graph">
          {formatedData.chartData.length > 0 ? (
            <LineChart
              chartData={formatedData.chartData}
              lines={formatedData.lines}
              higherValue={formatedData.higherValue}
            />
          ) : (
            <p>No violations data to be found</p>
          )}
        </div>
      </Tile>
    );
  }
}

export default Graph;
