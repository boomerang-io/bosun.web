import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { Error404, Loading, NotificationsContainer } from "@boomerang-io/carbon-addons-boomerang-react";
import { appPath } from "Config/appConfig";
import styles from "./Main.module.scss";

const EditPolicy = lazy(() => import(/* webpackChunkName: "EditPolicy" */ "Features/EditPolicy"));
const CreatePolicy = lazy(() => import(/* webpackChunkName: "CreatePolicy" */ "Features/CreatePolicy"));
const CreateTemplate = lazy(() => import(/* webpackChunkName: "CreateTemplate" */ "Features/CreateTemplate"));
const EditTemplate = lazy(() => import(/* webpackChunkName: "EditTemplate" */ "Features/EditTemplate"));
const Overview = lazy(() => import(/* webpackChunkName: "Overview" */ "Features/Overview"));
const Templates = lazy(() => import(/* webpackChunkName: "Templates" */ "Features/Templates"));

function Main() {
  return (
    <main id="content" className={styles.container}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path={appPath.createTemplate} component={CreateTemplate} />
          <Route path={appPath.editTemplate} component={EditTemplate} />
          <Route exact path={appPath.templates} component={Templates} />
          <Route path={appPath.editPolicy} component={EditPolicy} />
          <Route path={appPath.createPolicy} component={CreatePolicy} />
          <Route path={appPath.overview} component={Overview} />
          <Route exact path="/" component={Overview} />
          <Route path="*" component={() => <Error404 theme="boomerang"/>} />
        </Switch>
      </Suspense>
      <NotificationsContainer enableMultiContainer />
    </main>
  );
}

export default Main;
