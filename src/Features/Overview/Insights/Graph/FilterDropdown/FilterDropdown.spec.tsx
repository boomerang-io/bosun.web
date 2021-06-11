import React from "react";
import FilterDropdown from ".";
const mockfn = jest.fn();
const label = "testLabel";
const options = [{ text: "option1", value: "option1" }];
const onChange = mockfn;
describe("FilterDropdown --- Snapshot", () => {
  it("Capturing Snapshot of FilterDropdown", async () => {
    const { baseElement } = (global as any).rtlRender(
      <FilterDropdown label={label} options={options} onChange={onChange} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
