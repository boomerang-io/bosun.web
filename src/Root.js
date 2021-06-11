import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryConfigProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { ErrorBoundary } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorFullPage from "Components/ErrorFullPage";
import App from "Features/App";
import { APP_ROOT } from "Config/appConfig";

export default function Root() {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      <ReactQueryConfigProvider config={{ queries: { throwOnError: true }, mutations: { throwOnError: true } }}>
        <ErrorBoundary errorComponent={ErrorFullPage}>
          <BrowserRouter basename={APP_ROOT}>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </ReactQueryConfigProvider>
    </>
  );
}
