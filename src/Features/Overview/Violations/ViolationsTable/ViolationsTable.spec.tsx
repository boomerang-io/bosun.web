import React from "react";
import ViolationsTable from "./index";
import { violations as violationsData } from "ApiServer/fixtures";

const violations = [violationsData[0]];
describe("ViolationsTable --- Snapshot", () => {
  it("Capturing Snapshot of ViolationsTable", async () => {
    const { baseElement } = (global as any).rtlRender(<ViolationsTable violations={violations} />);
    expect(baseElement).toMatchSnapshot();
  });
});
