import { Server, Serializer, Model } from "miragejs";
import { inflections } from "inflected";
import uuid from "uuid/v4";
import { serviceUrl } from "Config/servicesConfig";
import * as fixtures from "./fixtures";

export function startApiServer({ environment = "test", timing = 0 } = {}) {
  inflections("en", function (inflect) {
    // Prevent pluralization bc our apis are weird
    inflect.irregular("policy", "policy");
    inflect.irregular("violation", "violation");
    inflect.irregular("template", "template");
    inflect.irregular("insights", "insights");
  });

  return new Server({
    environment,
    // Load in mock data
    fixtures,
    // Return the data as is, don't add a root key
    serializers: {
      application: Serializer.extend({
        root: false,
        embed: true,
      }),
    },
    // Register the data as a model so we can use the schema
    models: {
      templates: Model,
      policies: Model,
    },

    routes() {
      // Control how long the responses take to resolve
      this.timing = timing;

      // Allow unhandled requests on the current domain to pass through
      this.passthrough();

      this.get("/info", () => []);

      /**
       * Simple GET of static data
       */
      this.get(serviceUrl.getUserProfile(), (schema) => {
        return schema.db.profile[0];
      });
      this.get(serviceUrl.getCicdNavigation({}), (schema, request) => {
        return schema.db.cicdNavigation.map((item) => {
          if (typeof item.link === "string") {
            item.link = item.link.replace(":teamId", request.queryParams.teamId);
          }

          return item;
        });
      });

      this.get(serviceUrl.getPlatformNavigation(), (schema) => {
        return schema.db.navigation[0];
      });

      this.get(serviceUrl.getTeams(), (schema) => {
        return schema.db.teams;
      });

      this.get(serviceUrl.getPolicy({ policyId: ":policyId" }), (schema, request) => {
        let { policyId } = request.params;
        let activePolicy = schema.policies.find(policyId);
        return activePolicy;
      });

      this.get(serviceUrl.getValidateInfo({ policyId: ":policyId" }), (schema) => {
        return schema.db.validateInfo;
      });

      this.get(serviceUrl.getTemplates(), (schema) => {
        return schema.db.templates;
      });

      this.get(serviceUrl.getPolicyOverview(), (schema, request) => {
        let { teamId } = request.queryParams;
        return schema.db.policies.filter((policy) => policy.teamId === teamId);
      });

      this.get(serviceUrl.getViolationsOverview(), (schema) => {
        return schema.db.violations;
      });

      this.get(serviceUrl.getInsightsOverview(), (schema) => {
        return schema.db.insights;
      });

      this.post(serviceUrl.postCreatePolicy(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        return schema.policies.create({ ...body, id: uuid() });
      });

      this.post(serviceUrl.postCreatePolicyTemplate(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        return schema.templates.create({ ...body, id: uuid() });
      });

      this.patch(serviceUrl.patchUpdatePolicy({ policyId: ":policyId" }), (schema, request) => {
        let { policyId } = request.params;
        let body = JSON.parse(request.requestBody);
        let activePolicy = schema.policies.find(policyId);
        activePolicy.update(body);
        return schema.policies.all();
      });

      this.patch(serviceUrl.patchUpdatePolicyTemplate({ templateId: ":templateId" }), (schema, request) => {
        let { templateId } = request.params;
        let body = JSON.parse(request.requestBody);
        let activeTemplate = schema.templates.find(templateId);
        activeTemplate.update(body);
        return schema.templates.all();
      });

      this.delete(serviceUrl.deletePolicy({ policyId: ":policyId" }), (schema, request) => {
        let { policyId } = request.params;
        let activePolicy = schema.policies.find(policyId);
        activePolicy.destroy({ id: policyId });
        return schema.policies.all();
      });
    },
  });
}
