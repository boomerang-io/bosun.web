import { BASE_LAUNCH_ENV_URL } from "./platformUrlConfig";
// Look for the data injected into the HTML file from the Express app
// See server/app.js for implementation
export const APP_ROOT = window?._SERVER_DATA?.APP_ROOT ?? "/bosun";

export const PRODUCT_STANDALONE = process.env.PRODUCT_STANDALONE === "true" ?? false;;

// TODO
export const ROUTES = {};
export const appPath = {
  root: APP_ROOT,
  createPolicy: "/teams/:teamId/policy/create",
  createTemplate: "/templates/create",
  editPolicy: "/teams/:teamId/policy/edit/:policyId",
  editTemplate: "/templates/edit/:templateId",
  overview: "/teams/:teamId",
  templates: "/templates",
};

export const appLink = {
  policyTemplates: () => `/templates`,
  createPolicy: ({ teamId }) => `/teams/${teamId}/policy/create`,
  createTemplate: () => `/templates/create`,
  editPolicy: ({ teamId, policyId }) => `/teams/${teamId}/policy/edit/${policyId}`,
  editTemplate: ({ templateId }) => `/templates/edit/${templateId}`,
  teamOverview: ({ teamId }) => `/teams/${teamId}`,

  // CICD
  home: ({ activeTeamId }) => `${BASE_LAUNCH_ENV_URL}/cicd/apps/teams/${activeTeamId}`,
  components: ({ activeTeamId }) => `${BASE_LAUNCH_ENV_URL}/cicd/apps/teams/${activeTeamId}/components`,
  pipelines: ({ activeTeamId }) => `${BASE_LAUNCH_ENV_URL}/cicd/apps/teams/${activeTeamId}/pipelines`,
  scorecard: ({ activeTeamId }) => `${BASE_LAUNCH_ENV_URL}/cicd/apps/teams/${activeTeamId}/scorecard`,
  insights: ({ activeTeamId }) => `${BASE_LAUNCH_ENV_URL}/cicd/apps/teams/${activeTeamId}/insights`,
  componentModes: () => `${BASE_LAUNCH_ENV_URL}/cicd/apps/admin/component-modes`,
  properties: () => `${BASE_LAUNCH_ENV_URL}/cicd/apps/admin/properties`,
  scmRepositories: () => `${BASE_LAUNCH_ENV_URL}/cicd/apps/admin/repositories`,
  settings: () => `${BASE_LAUNCH_ENV_URL}/cicd/apps/admin/settings`,
  teamProperties: ({ activeTeamId }) => `${BASE_LAUNCH_ENV_URL}/cicd/apps/teams/${activeTeamId}/properties`,
  teamConfiguration: ({ activeTeamId }) => `${BASE_LAUNCH_ENV_URL}/cicd/apps/teams/${activeTeamId}/configuration`,

  // Lib
  lib: () => `${BASE_LAUNCH_ENV_URL}/cicd/apps/lib`,
};

export const FeatureFlag = {
  Standalone: "standalone",
};
