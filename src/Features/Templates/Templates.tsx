import React from "react";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import {
  ErrorMessage,
  SkeletonPlaceholder,
  DataTableSkeleton,
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import TemplatesTable from "./TemplatesTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { PolicyDefinitionTemplate } from "Types";

export function TemplatesContainer() {
  const getTemplatesUrl = serviceUrl.getTemplates();
  const { data: templatesData, isLoading, error } = useQuery<PolicyDefinitionTemplate[], any>({
    queryKey: getTemplatesUrl,
    queryFn: resolver.query(getTemplatesUrl),
  });

  return (
    <>
      <Helmet>
        <title>Bosun Policy Templates</title>
      </Helmet>
      <FeatureHeader
        includeBorder={false}
        header={
          <>
            <FeatureHeaderSubtitle>These are the</FeatureHeaderSubtitle>
            <FeatureHeaderTitle>Policy Templates</FeatureHeaderTitle>
          </>
        }
      />
      {isLoading ? (
        <div style={{ padding: "2rem" }}>
          <SkeletonPlaceholder style={{ maxHeight: "2.5rem", marginBottom: "1rem", width: "100%" }} />
          <DataTableSkeleton columnCount={4} />
        </div>
      ) : error ? (
        <div style={{ marginTop: "2rem" }}>
          <ErrorMessage />
        </div>
      ) : (
        <TemplatesTable data={templatesData ?? []} />
      )}
    </>
  );
}

export default TemplatesContainer;
