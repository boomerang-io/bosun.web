export enum PlatformRole {
  Admin = "admin",
  Auditor = "auditor",
  Operator = "operator",
  User = "user",
}

export interface AppContextProps {
  teams: Array<PolicyTeam>;
  activeTeam: PolicyTeam | null;
}

export interface StringKeyObject {
  [key: string]: string | string[] | undefined | number;
};

export interface ObjectOfStringKeyObject {
  [key: string]: StringKeyObject;
};

export interface FormikSetFieldValue {
  (id: string, value: string | Array<string> | boolean | undefined | Array<any> | void): void;
  value: string;
  type?: string;
}
/**
 * CICD general
 */
export interface CICDUser {
  id: string;
  email: string;
  name: string;
  isFirstVisit: boolean;
  type: string;
  hasConsented: boolean;
  isShowHelp: boolean;
  firstLoginDate: string | number;
  lastLoginDate: string | number;
  lowerLevelGroupIds: Array<string>;
  pinnedToolIds: Array<string>;
  favoritePackages: Array<any>;
  personalizations: any;
  notificationSettings: any;
}

export interface PlatformNavigation {
  navigation: Array<{ name: string; url: string }>;
  features: any;
  platform: {
    version: string;
    name: string;
    signOutUrl: string;
    communityUrl: string;
    platformName: string;
    displayLogo: boolean;
    privateTeams: boolean;
    sendMail: boolean;
  };
  featuredServices: Array<any>;
}

type CICDNavigationItemType = "link" | "category";

export interface CICDNavigationItem {
  icon?: string;
  name: string;
  link: string;
  type: CICDNavigationItemType;
  childLinks: CICDNavigationItem[];
}

export interface CICDTeam {
  id: string;
  name: string;
  higherLevelGroupId: string;
  ucdApplicationId: string;
  isActive: boolean;
  enableComponentCreation: string;
  userRoles: Array<string>;
  settings: any;
  audits: Array<any>;
  boomerangTeamName: string;
  boomerangTeamShortname: string;
}
export interface PolicyTeam {
  id: string;
  name: string;
}
export interface PolicyDataProps {
  name: string;
  teamId: string;
}
export interface PolicyData extends PolicyDataProps {
  id: string;
  createdDate?: string;
  definitions: PolicyDefinitionTemplate[] | PolicyDefinition[];
  stages?: string[];
}
export interface EditPolicyData extends PolicyDataProps {
  id: string;
  definitions: PolicyDefinition[];
}
 export interface CreatePolicyData extends PolicyDataProps {
  definitions: PolicyDefinition[];
 }
export interface PolicyInput {
  id?: string;
  key: string;
  label: string;
  type: string;
  defaultValue: string;
  required?: boolean;
  description: string;
  options?: string[] | null;
}

export interface PolicyDefinitionTemplate {
  id: string;
  key: string;
  createdDate?: string;
  name: string;
  description: string;
  order: number;
  rego: string;
  labels: string[];
  rules: Array<PolicyInput>;
}

export interface PolicyDefinition {
  policyTemplateId: string;
  rules: StringKeyObject[] | string[] | {metric: string; operator: string; value: string;}[];
}

export interface ValidateInfo {
  policyId: string;
  referenceId: null;
  referenceLink: null;
  labels: {
      "artifact-path": string;
      "artifact-name": string;
      "artifact-version": string;
      "sonarqube-id": string;
      "sonarqube-version": string;
  };
  annotations: null;
  data: null;
}


// Insights
export interface InsightsData {
  policyId: string;
  policyName: string;
  policyCreatedDate: string;
  insights: {
      policyActivityId: string;
      policyActivityCreatedDate: string;
      violations: number;
  }[];
};
export interface Violation {
  id: string;
  policyId: string;
  policyName: string;
  policyActivityCreatedDate: string;
  policyDefinitionTypes: string[];
  nbrViolations: number;
  violations: {
    metric: string;
    message: string;
    valid: boolean;
  }[];
  labels: StringKeyObject;
  annotations?: StringKeyObject;
  referenceLink?:string;
  referenceId?:string;
};
export interface ChartsData {
  chartData: ObjectOfStringKeyObject[];
  higherValue: number;
  lines: string[];
  totalViolations: number;
};
export interface ChartsDot {
  key: string;
  y: string;
};
export interface Info {
  type: string;
  title: string;
  content: string;
  count: number;
};
