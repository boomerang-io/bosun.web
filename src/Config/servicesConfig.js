import axios, { CancelToken } from "axios";
import HTTPMethods from "Constants/httpMethods";
import portForwardMap from "../setupPortForwarding";

//const REACT_APP_PORT_FORWARD = process.env.REACT_APP_PORT_FORWARD;

export const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production" ? window._SERVER_DATA && window._SERVER_DATA.BASE_SERVICE_ENV_URL : "/api";

export const PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production" ? window._SERVER_DATA && window._SERVER_DATA.PRODUCT_SERVICE_ENV_URL : "/api";

export const CICD_PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production"
    ? window._SERVER_DATA && window._SERVER_DATA.CICD_PRODUCT_SERVICE_ENV_URL
    : "/api";

const REACT_APP_PORT_FORWARD = process.env.REACT_APP_PORT_FORWARD;

/**
 * if port forwarding is enabled, then check to see if service is in config map
 * If it is, set the url request to be only the serviceContextPath so the url is relativet to the root of the app
 * CRA will proxy the request as seen in setupProxy.js
 * @param {string} baseUrl - base of the serivce url
 * @param {sring} serviceContextPath - additional path for the service context e.g. /admin
 */
function determineUrl(baseUrl, serviceContextPath) {
  if (REACT_APP_PORT_FORWARD && portForwardMap[serviceContextPath]) {
    return serviceContextPath;
  } else {
    return baseUrl + serviceContextPath;
  }
}
export const BASE_SERVICE_USERS_URL = determineUrl(BASE_SERVICE_ENV_URL, "/users");
export const BASE_SERVICE_PRODUCT_URL = determineUrl(PRODUCT_SERVICE_ENV_URL, "/policy");
export const BASE_CICD_PRODUCT_URL = determineUrl(CICD_PRODUCT_SERVICE_ENV_URL, "/ci");
// Product
export const SERVICE_REQUEST_STATUSES = {
  FAILURE: "failure",
  SUCCESS: "success",
};

export const serviceUrl = {
  deletePolicy: ({ policyId }) => `${BASE_SERVICE_PRODUCT_URL}/policies/${policyId}`,
  getCicdNavigation: ({ teamId }) => `${BASE_CICD_PRODUCT_URL}/navigation${teamId ? "?teamId=" + teamId : ""}`,
  getInsights: ({ teamId }) => `${BASE_SERVICE_PRODUCT_URL}/policies/insights?teamId=${teamId}`,
  getInsightsOverview: () => `${BASE_SERVICE_PRODUCT_URL}/policies/insights`,
  getPlatformNavigation: () => `${BASE_SERVICE_USERS_URL}/navigation`,
  getPolicy: ({ policyId }) => `${BASE_SERVICE_PRODUCT_URL}/policies/${policyId}`,
  getPolicyOverview: () => `${BASE_SERVICE_PRODUCT_URL}/policies`,
  getTeams: () => `${BASE_SERVICE_PRODUCT_URL}/teams`,
  getTeamPolicies: ({ teamId }) => `${BASE_SERVICE_PRODUCT_URL}/policies?teamId=${teamId}`,
  getTemplates: () => `${BASE_SERVICE_PRODUCT_URL}/templates`,
  getUserProfile: () => `${BASE_SERVICE_USERS_URL}/profile`,
  getValidateInfo: ({ policyId }) => `${BASE_SERVICE_PRODUCT_URL}/validate/info/${policyId}`,
  getViolations: ({ teamId }) => `${BASE_SERVICE_PRODUCT_URL}/policies/violations?teamId=${teamId}`,
  getViolationsOverview: () => `${BASE_SERVICE_PRODUCT_URL}/policies/violations`,
  patchUpdatePolicy: ({ policyId }) => `${BASE_SERVICE_PRODUCT_URL}/policies/${policyId}`,
  patchUpdatePolicyTemplate: ({ templateId }) => `${BASE_SERVICE_PRODUCT_URL}/templates/${templateId}`,
  postCreatePolicy: () => `${BASE_SERVICE_PRODUCT_URL}/policies`,
  postCreatePolicyTemplate: () => `${BASE_SERVICE_PRODUCT_URL}/templates`,
  postCreateTeam: () => `${BASE_SERVICE_PRODUCT_URL}/teams`,
};

export const cancellableResolver = ({ url, method, body, ...config }) => {
  // Create a new CancelToken source for this request
  const source = CancelToken.source();
  const promise = axios({ url, method, body, cancelToken: source.token, ...config });
  return { promise, cancel: () => source.cancel("cancel") };
};

export const resolver = {
  query: (url) => () => axios.get(url).then((response) => response.data),
  postMutation: (request) => axios.post(request),
  patchMutation: (request) => axios.patch(request),
  putMutation: (request) => axios.put(request),
  deletePolicy: ({ policyId }) =>
    cancellableResolver({ url: serviceUrl.deletePolicy({ policyId }), method: HTTPMethods.Delete }),
  patchUpdatePolicy: ({ policyId, body }) =>
    cancellableResolver({ url: serviceUrl.patchUpdatePolicy({ policyId }), method: HTTPMethods.Patch, data: body }),
  patchUpdatePolicyTemplate: ({ templateId, body }) =>
    cancellableResolver({
      url: serviceUrl.patchUpdatePolicyTemplate({ templateId }),
      method: HTTPMethods.Patch,
      data: body,
    }),
  postCreatePolicy: ({ body }) =>
    cancellableResolver({ url: serviceUrl.postCreatePolicy(), method: HTTPMethods.Post, data: body }),
  postCreatePolicyTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.postCreatePolicyTemplate(), method: HTTPMethods.Post, data: body }),
  postCreateTeam: ({ body }) =>
    cancellableResolver({ url: serviceUrl.postCreateTeam(), data: body, method: HTTPMethods.Post }),
};
