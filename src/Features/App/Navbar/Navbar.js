import React from "react";
import PropTypes from "prop-types";
import { useFeature } from "flagged";
import { NavLink, useLocation } from "react-router-dom";
import {
  LeftSideNav,
  UIShell,
  SideNavLink,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { SideNav } from "carbon-components-react";
import { BASE_LAUNCH_ENV_URL } from "Config/platformUrlConfig";
import { BASE_SERVICE_ENV_URL } from "Config/servicesConfig";
import { appPath } from "Config/appConfig";
import {
  Apps16,
  Analytics16,
  FlowData16,
  Home16,
  Locked16,
  Rocket16,
  Document16,
  ReportData16,
  Settings16,
  SettingsAdjust16,
} from "@carbon/icons-react";
import { FeatureFlag } from "Config/appConfig";
import styles from "./navbar.module.scss";

const ACTIVE_CLASS_NAME = "bx--side-nav__link--current";

const navigationIconMap = {
  Apps16,
  Home16,
  Rocket16,
  ReportData16,
  Analytics16,
  Document16,
  Locked16,
  SettingsAdjust16,
  FlowData16,
  Settings16,
};

const defaultUIShellProps = {
  appName: "Bosun",
  baseLaunchEnvUrl: BASE_LAUNCH_ENV_URL,
  baseServiceUrl: BASE_SERVICE_ENV_URL,
  renderLogo: true,
};

const skipToContentProps = {
  href: "#content",
};


Navbar.propTypes = {
  activeTeam: PropTypes.object.isRequired,
  cicdNavigationState: PropTypes.object.isRequired,
  platformNavigationState: PropTypes.object.isRequired,
  userState: PropTypes.object.isRequired,
};

function Navbar({ activeTeam, platformNavigationState, cicdNavigationState, userState }) {
  const isStandaloneMode = useFeature(FeatureFlag.Standalone);
  const location = useLocation();

  return isStandaloneMode ? (
    <UIShell
      {...defaultUIShellProps}
      productName="Bosun"
      headerConfig={platformNavigationState?.data ?? {}}
      onMenuClick={({ isOpen, onMenuClose }) => (
        <LeftSideNav isOpen={isOpen}>
          <SideNav expanded={isOpen} isChildOfHeader={true}>
            <SideNavItems large>
              <SideNavLink
                exact
                activeClassName={ACTIVE_CLASS_NAME}
                element={NavLink}
                isActive={!location.pathname.startsWith(appPath.templates)}
                onClick={onMenuClose}
                renderIcon={Rocket16}
                to="/"
              >
                Policies
              </SideNavLink>
              <SideNavLink
                activeClassName={ACTIVE_CLASS_NAME}
                element={NavLink}
                onClick={onMenuClose}
                to={`/templates`}
                renderIcon={Document16}
              >
                Policy Templates
              </SideNavLink>
            </SideNavItems>
          </SideNav>
        </LeftSideNav>
      )}
      user={userState?.data ?? {}}
      skipToContentProps={skipToContentProps}
    />
  ) : (
    <UIShell
      {...defaultUIShellProps}
      headerConfig={platformNavigationState?.data ?? {}}
      onMenuClick={({ isOpen, onMenuClose }) => (
        <LeftSideNav isOpen={isOpen}>
          <SideNav aria-label="Navigation" expanded={isOpen} isChildOfHeader={true}>
            <SideNavItems>
              {cicdNavigationState?.data && <LocalSideNav cicdNavigation={cicdNavigationState.data} onMenuClose={onMenuClose} />}
            </SideNavItems>
          </SideNav>
        </LeftSideNav>
      )}
    />
  );
}

function LocalSideNav({ onMenuClose, cicdNavigation }) {
  if (!cicdNavigation) {
    return null;
  }

  const sidenav = cicdNavigation.map((item, idx) => {
    const navigationIcon = item?.icon ? navigationIconMap[item.icon] : undefined;
    if (item.childLinks) {
      return (
        <SideNavMenu large title={item.name} renderIcon={navigationIcon}>
          {item.childLinks.map((item) => {
            const linkTypeProps = getSideNavLinkType(item, onMenuClose);
            return (
              <SideNavMenuItem large renderIcon={navigationIcon} {...linkTypeProps}>
                {item.name}
              </SideNavMenuItem>
            );
          })}
        </SideNavMenu>
      );
    } else {
      const linkTypeProps = getSideNavLinkType(item, onMenuClose);
      const isHomeLink = idx === 0;
      return (
        <>
          <SideNavLink large exact={isHomeLink} renderIcon={navigationIcon} {...linkTypeProps}>
            {item.name}
          </SideNavLink>
          {isHomeLink && <Divider />}
        </>
      );
    }
  });

  return <>{sidenav}</>;
}

function getSideNavLinkType(navItem, onClick) {
  let navLinkProps: NavLinkProps = {};

  try {
    const parsedUrl = new URL(navItem.link);
    if (parsedUrl.pathname.startsWith(appPath.root)) {
      navLinkProps.activeClassName = ACTIVE_CLASS_NAME;
      navLinkProps.to = parsedUrl.pathname.replace(appPath.root, "");
      navLinkProps.element = NavLink;
      navLinkProps.onClick = onClick;
    } else {
      navLinkProps.href = navItem.link;
    }
  } catch (e) {
    //no-op
  }

  return navLinkProps;
}

function Divider() {
  return <div className={styles.divider} />;
}

export default Navbar;
