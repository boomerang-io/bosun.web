import React from "react";
import Violations from "./index";
import { violations as violationsData } from "ApiServer/fixtures";

const violations = [violationsData[0]];
describe("Violations --- Snapshot", () => {
  it("Capturing Snapshot of Violations", async () => {
    const { baseElement } = (global as any).rtlRender(<Violations violations={violations} hasPolicies={true} />);
    expect(baseElement).toMatchSnapshot();
  });
});
