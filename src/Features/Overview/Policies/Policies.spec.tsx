import React from "react";
import Policies from "./index";
import { policies as policiesData } from "ApiServer/fixtures";
const policies = [policiesData[1]];
describe("Policies --- Snapshot", () => {
  it("Capturing Snapshot of Policies", async () => {
    const { baseElement } = (global as any).rtlRouterRender(<Policies policies={policies} />);
    expect(baseElement).toMatchSnapshot();
  });
});
