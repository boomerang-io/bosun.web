import React from "react";
import Insights from "./index";
import { insights, policies as policiesData, violations as violationsData } from "ApiServer/fixtures";

const violations = [violationsData[0]];
const policies = [policiesData[1]];

describe("Insights --- Snapshot", () => {
  it("Capturing Snapshot of Insights", async () => {
    const { baseElement } = (global as any).rtlRender(
      <Insights insights={insights} policies={policies} violations={violations} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
