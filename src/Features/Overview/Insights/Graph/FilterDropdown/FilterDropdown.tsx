import React from "react";
import { Dropdown } from "@boomerang-io/carbon-addons-boomerang-react";

type Props = {
  label: string;
  options: any[];
  onChange: (...args: any[]) => void;
  selectedItem?: any;
};

export function FilterDropdown({ selectedItem, onChange, options, label }: Props) {
  return (
    <div style={{ width: "15rem", height: "3rem" }}>
      <Dropdown
        id="filter-dropdown"
        label={label}
        onChange={onChange}
        selectedItem={selectedItem}
        items={options}
        titleText={label}
      />
    </div>
  );
}

export default FilterDropdown;
