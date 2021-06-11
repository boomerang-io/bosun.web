import React from "react";
import TeamSelector from ".";
import { teams } from "ApiServer/fixtures";
const mockfn = jest.fn();
describe("TeamSelector --- Snapshot", () => {
  it("Capturing Snapshot of TeamSelector", async () => {
    const { baseElement } = (global as any).rtlRender(<TeamSelector handleChangeTeam={mockfn} teams={teams} />);
    expect(baseElement).toMatchSnapshot();
  });
});
