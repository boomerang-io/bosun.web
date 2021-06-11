import React, { Component } from "react";
import "./styles.scss";

type Props = {
  payload?: any[];
};

class CustomTooltip extends Component<Props> {
  renderTooltip = (tooltipFields: any) => {
    return tooltipFields.map((field: any, index: any) => {
      return (
        <p key={`${field}-${index}`} className="b-tooltip--data">
          {" "}
          <span className="b-tooltip--field">{`${
            field === "passRate" ? "pass rate" : field === "criticalViolations" ? "critical violations" : field
          }: `}</span>
          {this.props.payload && `${this.props.payload[0].payload[field]}`}
        </p>
      );
    });
  };
  render() {
    const tooltipFields =
      this.props.payload && this.props.payload.length > 0 ? Object.keys(this.props.payload[0].payload) : null;
    return (
      <div className="c-tooltip">
        {this.props.payload && this.props.payload.length > 0 ? <div>{this.renderTooltip(tooltipFields)}</div> : null}
      </div>
    );
  }
}

export default CustomTooltip;
