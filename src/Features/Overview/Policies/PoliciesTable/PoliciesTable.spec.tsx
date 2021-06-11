import React from "react";
import PoliciesTable from "./index";
import { policies as policiesData } from "ApiServer/fixtures";

const policies = [policiesData[1]];
describe("PoliciesTable --- Snapshot", () => {
  it("Capturing Snapshot of PoliciesTable", async () => {
    const { baseElement } = (global as any).rtlRouterRender(<PoliciesTable policies={policies} />);
    expect(baseElement).toMatchSnapshot();
  });
});
