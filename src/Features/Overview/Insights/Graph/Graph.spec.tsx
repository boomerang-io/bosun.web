import React from "react";
import Graph from "./index";

const formatedData = {
  chartData: [{ date: 1558457676, test1: 1, test2: 2 }],
  lines: ["test1", "test2"],
  higherValue: 2,
  totalViolations: 0,
};

describe("Graph --- Snapshot", () => {
  it("Capturing Snapshot of Graph", async () => {
    //TO-DO Check how to handle this kind of object
    //@ts-ignore
    const { baseElement } = (global as any).rtlRender(<Graph formatedData={formatedData} />);
    expect(baseElement).toMatchSnapshot();
  });
});
