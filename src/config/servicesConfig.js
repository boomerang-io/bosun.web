export const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : window?._SERVER_DATA?.BASE_SERVICE_ENV_URL;

export const PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : window?._SERVER_DATA?.PRODUCT_SERVICE_ENV_URL;

// Product
export const SERVICE_PRODUCT_BASE_PATH = "/bosun";
export const SERVICE_PRODUCT_TEMPLATES_PATH = `${SERVICE_PRODUCT_BASE_PATH}/templates`;
export const SERVICE_PRODUCT_INSIGHTS_PATH = `${SERVICE_PRODUCT_BASE_PATH}/policies/insights`;
export const SERVICE_PRODUCT_POLICIES_PATH = `${SERVICE_PRODUCT_BASE_PATH}/policies`;
export const SERVICE_PRODUCT_VALIDATION_INFO_PATH = `${SERVICE_PRODUCT_BASE_PATH}/validate/info`;
export const SERVICE_PRODUCT_TEAM_PATH = `${SERVICE_PRODUCT_BASE_PATH}/teams`;
export const SERVICE_PRODUCT_VIOLATIONS_PATH = `${SERVICE_PRODUCT_BASE_PATH}/policies/violations`;

// Platform
export const SERVICE_PLATFORM_PROFILE_PATH = `${BASE_SERVICE_ENV_URL}/users/profile`;
export const SERVICE_PLATFORM_NAVIGATION_PATH = `${BASE_SERVICE_ENV_URL}/users/navigation`;

export const SERVICE_REQUEST_STATUSES = {
  FAILURE: "failure",
  SUCCESS: "success"
};
