import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render as rtlRender } from "@testing-library/react";
import { ReactQueryConfigProvider } from "react-query";
import { AppContext } from "State/context";
import { teams as teamsFixture, profile as userFixture } from "ApiServer/fixtures";
import "@testing-library/jest-dom";

function rtlRouterRender(
  ui,
  queryConfig = {},
  { route = "/", history = createMemoryHistory({ initialEntries: [route] }), ...options } = {}
) {
  return {
    ...rtlRender(
      <ReactQueryConfigProvider config={{ queries: { retry: false }, ...queryConfig }}>
        <Router history={history}>{ui}</Router>
      </ReactQueryConfigProvider>,
      options
    ),
    history,
  };
}

const defaultContextValue = {
  user: userFixture,
  teams: teamsFixture,
  activeTeam: { id: "5a8b331e262a70306622df73", userRoles: ["operator"] },
  setActiveTeam: () => {},
  refetchTeams: () => {},
};
function rtlContextRouterRender(
  ui,
  {
    contextValue = {},
    initialState = {},
    queryConfig = {},
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    ...options
  } = {}
) {
  return {
    ...rtlRender(
      <ReactQueryConfigProvider config={{ queries: { retry: false }, ...queryConfig }}>
        <AppContext.Provider value={{ ...defaultContextValue, ...contextValue }}>
          <Router history={history}>{ui}</Router>
        </AppContext.Provider>
      </ReactQueryConfigProvider>,
      options
    ),
    history,
  };
}

// RTL globals
// Open question if we want to attach these to the global or required users to import
global.rtlRender = rtlRender;
global.rtlRouterRender = rtlRouterRender;
global.rtlContextRouterRender = rtlContextRouterRender;

// mock document text range
global.document.createRange = () => {
  return {
    setEnd: () => {},
    setStart: () => {},
    getBoundingClientRect: () => {},
  };
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

global.sessionStorage = sessionStorageMock;

//Dates
const moment = jest.requireActual("moment-timezone");
jest.doMock("moment", () => {
  moment.tz.setDefault("UTC");
  moment.tz.guess(false);
  const DATE_TO_USE = new Date("Jan 1 2020 00:00:00 UTC");
  const mom = () => jest.requireActual("moment")(DATE_TO_USE);
  mom.utc = jest.requireActual("moment").utc;
  return mom;
});

// React-modal
beforeEach(() => {
  document.body.setAttribute("id", "app");
});
const originalConsoleError = console.error;
console.error = (message, ...rest) => {
  if (typeof message === "string" && !message.includes("react-modal: App element is not defined")) {
    originalConsoleError(message, ...rest);
  }
};
