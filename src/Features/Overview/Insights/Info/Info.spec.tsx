import React from "react";
import Info from ".";
const info = {
  type: "test",
  title: "Test title",
  content: "Test content text",
  count: 0,
};
describe("Info --- Snapshot", () => {
  it("Capturing Snapshot of Info", async () => {
    const { baseElement } = (global as any).rtlRender(<Info info={info} />);
    expect(baseElement).toMatchSnapshot();
  });
});
