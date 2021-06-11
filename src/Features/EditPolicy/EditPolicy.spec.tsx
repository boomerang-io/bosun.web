import React from "react";
import { Response } from "miragejs";
import { fireEvent, screen } from "@testing-library/react";
import { queryCaches } from "react-query";
import { startApiServer } from "ApiServer";
import EditPolicy from "../EditPolicy";
import { serviceUrl } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";

const teamId = "5a8b331e262a70306622df73";
const policyId = "5cd49adff6ea74a9bb6adef3";
const route = appLink.editPolicy({ teamId, policyId });
const props = {
  match: { params: { policyId: "5cd49adff6ea74a9bb6adef3" } },
  history: {},
};

// Mock "uuid" lib so we can get useful snapshots
jest.mock("uuid", () => {
  let count = 0;
  return {
    name: "uuid",
    v4: () => {
      count += 1;
      return count;
    },
  };
});

let server: any;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("EditPolicy --- Snapshot", () => {
  beforeEach(() => {
    document.body.setAttribute("id", "app");
  });

  it("renders correctly", async () => {
    const { baseElement } = rtlRouterRender(<EditPolicy {...props} />, { route });
    await screen.findByText(/Edit Policy/i);
    await screen.findByText(/Static Code Analysis/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("EditPolicy --- RTL", () => {
  beforeEach(() => {
    document.body.setAttribute("id", "app");
  });

  test("renders error message when fetching definitions failed", async () => {
    server.get(serviceUrl.getTemplates(), () => {
      return new Response(404, {}, { data: { status: 404, error: "Error" } });
    });

    rtlRouterRender(<EditPolicy {...props} />, { route });
    const errorMessage = await screen.findByText("Oops, something went wrong.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("renders error message when fetching policy failed", async () => {
    rtlRouterRender(<EditPolicy {...props} />, { route });
    server.get(serviceUrl.getPolicy({ policyId: "5cd49adff6ea74a9bb6adef3" }), () => {
      return new Response(404, {}, { errors: ["Error"] });
    });
    const errorMessage = await screen.findByText("Oops, something went wrong.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("it is able to update policy only if it has a name", async () => {
    rtlRouterRender(<EditPolicy {...props} />, { route });
    await screen.findByText(/Edit Policy/i);
    await screen.findByText(/Static Code Analysis/i);

    const saveButton = await screen.findByTestId("policy-header-affirmative-action");

    const nameInput = screen.getByPlaceholderText(/name/i);
    fireEvent.change(nameInput, { target: { value: "" } });
    expect(saveButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "test" } });
    expect(saveButton).toBeEnabled();
  });

  test("save button is disabled while saving", async () => {
    rtlRouterRender(<EditPolicy {...props} />, { route });

    await screen.findByText(/Static Code Analysis/i);
    const saveButton = await screen.findByTestId("policy-header-affirmative-action");

    const nameInput = screen.getByPlaceholderText(/name/i);
    fireEvent.change(nameInput, { target: { value: "test" } });
    expect(saveButton).toBeEnabled();

    fireEvent.click(saveButton);
    expect(saveButton).toBeDisabled();
  });
});
