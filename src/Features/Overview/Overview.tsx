import React from "react";
import { Helmet } from "react-helmet";
import cx from "classnames";
import { settings } from "carbon-components";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import {
  ErrorMessage,
  SkeletonPlaceholder,
  DataTableSkeleton,
  ErrorDragon,
} from "@boomerang-io/carbon-addons-boomerang-react";
import Welcome from "Components/Welcome";
import Insights from "./Insights";
import Policies from "./Policies";
import TeamSelector from "./TeamSelector";
import Violations from "./Violations";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import AppContext from "State/context/appContext";
import { Violation, PolicyData, InsightsData, PolicyTeam } from "Types";
import styles from "./overview.module.scss";

const { prefix } = settings;

export function Overview() {
  const history = useHistory();
  const { activeTeam, teams } = React.useContext(AppContext);
  const activeTeamId = activeTeam?.id;

  const policiesUrl = serviceUrl.getTeamPolicies({ teamId: activeTeamId });
  const insightsUrl = serviceUrl.getInsights({ teamId: activeTeamId });
  const violationsUrl = serviceUrl.getViolations({ teamId: activeTeamId });

  const { data: policiesData, isLoading: policiesIsLoading, error: policiesError } = useQuery<PolicyData[], any>({
    queryKey: policiesUrl,
    queryFn: resolver.query(policiesUrl),
  });

  const { data: insightsData, isLoading: insightsIsLoading, error: insightsError } = useQuery<InsightsData[], any>({
    queryKey: insightsUrl,
    queryFn: resolver.query(insightsUrl),
  });

  const { data: violationsData, isLoading: violationsIsLoading, error: violationsError } = useQuery<Violation[], any>({
    queryKey: violationsUrl,
    queryFn: resolver.query(violationsUrl),
  });

  const handleChangeTeam = ({ selectedItem }: { selectedItem: PolicyTeam }) => {
    if (selectedItem?.id) {
      history.push(appLink.teamOverview({ teamId: selectedItem.id }));
    }
  };

  const RenderInsights = () => {
    if (insightsIsLoading || policiesIsLoading || violationsIsLoading)
      return (
        <div className={styles.skeletonContainer}>
          <div className={styles.dataSkeleton}>
            <SkeletonPlaceholder className={styles.tileSkeleton} />
            <SkeletonPlaceholder className={styles.tileSkeleton} />
          </div>
          <SkeletonPlaceholder className={styles.chartTileSkeleton} />
        </div>
      );
    if (insightsError || policiesError || violationsError) return <ErrorMessage />;
    return <Insights insights={insightsData ?? []} policies={policiesData ?? []} violations={violationsData ?? []} />;
  };

  const RenderPolicies = () => {
    if (policiesIsLoading)
      return (
        <div className={styles.tableSkeleton}>
          <SkeletonPlaceholder className={styles.titleSkeleton} />
          <DataTableSkeleton
            data-testid="policies-loading-skeleton"
            className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.policiesTableSkeleton)}
            rowCount={10}
            columnCount={4}
          />
        </div>
      );
    if (policiesError) return <ErrorMessage />;
    return <Policies policies={policiesData ?? []} activeTeamId={activeTeam?.id} />;
  };

  const RenderViolations = () => {
    if (violationsIsLoading)
      return (
        <div className={styles.tableSkeleton}>
          <SkeletonPlaceholder className={styles.titleSkeleton} />
          <DataTableSkeleton
            data-testid="policies-loading-skeleton"
            className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.violationsTableSkeleton)}
            rowCount={10}
            columnCount={5}
          />
        </div>
      );

    if (violationsError) return <ErrorMessage />;

    return <Violations hasPolicies={Boolean(policiesData?.length)} violations={violationsData ?? []} />;
  };

  function renderContent() {
    if (!activeTeam) {
      return <Welcome />;
    }

    if (policiesError && insightsError && violationsError) {
      return <ErrorDragon />;
    }
    return (
      <>
        <RenderInsights />
        <RenderPolicies />
        <RenderViolations />
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Bosun Home</title>
      </Helmet>
      <TeamSelector activeTeam={activeTeam} handleChangeTeam={handleChangeTeam} teams={teams} />
      {renderContent()}
    </div>
  );
}

export default Overview;
