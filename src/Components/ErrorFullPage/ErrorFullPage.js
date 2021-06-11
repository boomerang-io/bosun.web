import React from "react";
import { ErrorFullPage } from "@boomerang-io/carbon-addons-boomerang-react";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";

function ErrorFullPageWrapper(props: any) {
  return <ErrorFullPage theme="boomerang" statusUrl={`${BASE_LAUNCH_ENV_URL}/support/status`} {...props} />;
}

export default ErrorFullPageWrapper;
