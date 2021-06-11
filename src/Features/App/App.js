import React from "react";
import { Helmet } from "react-helmet";
import { matchPath, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { FlagsProvider } from "flagged";
import { ErrorBoundary, Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorFullPage from "Components/ErrorFullPage";
import Main from "./Main";
import Navbar from "./Navbar";
import { PRODUCT_STANDALONE } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import AppContext from "State/context/appContext";
import { appPath } from "Config/appConfig";
import styles from "./App.module.scss";

const userUrl = serviceUrl.getUserProfile();
const platformNavigationUrl = serviceUrl.getPlatformNavigation();
const teamsUrl = serviceUrl.getTeams();
const BOOMERANG_FALLBACK = "Boomerang";

export function App() {
  const history = useHistory();
  const location = useLocation();
  const teamsMatch = matchPath(location.pathname, { path: appPath.overview });
  const templatesMatch = matchPath(location.pathname, { path: appPath.templates });

  const [activeTeam, setActiveTeam] = React.useState();
  const activeTeamId = teamsMatch?.params?.teamId;
  const cicdNavigationUrl = serviceUrl.getCicdNavigation({ teamId: activeTeamId });

  const userState = useQuery({
    queryKey: userUrl,
    queryFn: resolver.query(userUrl),
  });
  const platformNavigationState = useQuery({
    queryKey: platformNavigationUrl,
    queryFn: resolver.query(platformNavigationUrl),
  });
  const teamsState = useQuery({
    queryKey: teamsUrl,
    queryFn: resolver.query(teamsUrl),
  });
  const cicdNavigationState = useQuery({
    queryKey: cicdNavigationUrl,
    queryFn: resolver.query(cicdNavigationUrl),
    config: { enabled: !Boolean(PRODUCT_STANDALONE) },
  });

  const platformName = platformNavigationState.data?.platform?.platformName ?? "";
  const isBoomerangInPlatformName = platformName?.includes(BOOMERANG_FALLBACK);
  const appTitle = !isBoomerangInPlatformName
    ? `${BOOMERANG_FALLBACK} Bosun - ${platformName}`
    : `${BOOMERANG_FALLBACK} Bosun`;

  React.useEffect(() => {
    if (!teamsState?.data) {
      return;
    }

    if (activeTeamId) {
      const activeTeam = teamsState.data?.find((team) => team.id === activeTeamId);
      setActiveTeam(activeTeam);
    } else {
      const firstTeam = teamsState.data[0];
      setActiveTeam(firstTeam);
      if (!templatesMatch) {
        history.replace(appLink.teamOverview({ teamId: firstTeam.id }));
      }
    }
  }, [activeTeam, activeTeamId, history, setActiveTeam, teamsState, templatesMatch]);

  function renderMain() {
    if (teamsState.isLoading) {
      return <Loading />;
    }

    if (teamsState.error) {
      return <ErrorFullPage style={{ margin: "3.5rem 0" }} />;
    }

    if (teamsState.data) {
      return (
        <AppContext.Provider value={{ activeTeam: activeTeam, teams: teamsState.data }}>
          <Main />
        </AppContext.Provider>
      );
    }

    return null;
  }

  return (
    <ErrorBoundary errorComponent={ErrorFullPage}>
      <FlagsProvider features={{ standalone: PRODUCT_STANDALONE }}>
        <div className={styles.container}>
          {platformNavigationState?.data && userState?.data && <Helmet defaultTitle={appTitle} titleTemplate={`%s - ${appTitle}`} />}
          <Navbar activeTeam={activeTeam} platformNavigationState={platformNavigationState} cicdNavigationState={cicdNavigationState} userState={userState} />
          {renderMain()}
        </div>
      </FlagsProvider>
    </ErrorBoundary>
  );
}

export default App;
