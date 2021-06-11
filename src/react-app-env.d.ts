/// <reference types="react-scripts" />
declare module "axios";
declare module "carbon-components";
declare module "classnames";
declare module "lodash/orderBy";
declare module "match-sorter";
declare module "nested-property";
declare module "react-lazylog";
declare module "react-redux";
declare module "react-router-dom";
declare module "react-transition-group/Transition";
declare module "recharts";
declare module "uuid";
declare module "@boomerang-io/carbon-addons-boomerang-react";
declare module "@boomerang-io/utils";
declare module "@carbon/charts-react";
declare module "@carbon/icons-react";

declare module "*.scss" {
  const styles: { [className: string]: string };
  export default styles;
}
