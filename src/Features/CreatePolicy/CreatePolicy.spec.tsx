import React from "react";
import { Response } from "miragejs";
import { fireEvent } from "@testing-library/react";
import { queryCaches } from "react-query";
import { startApiServer } from "ApiServer";
import CreatePolicy from "../CreatePolicy";
import { serviceUrl } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";

const route = appLink.createPolicy({ teamId: "5a8b331e262a70306622df73" });
const props = {
  match: { params: { policyId: "5cd49adff6ea74a9bb6adef3" } },
  history: {},
};
let server: any;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("CreatePolicy --- Snapshot", () => {
  it("renders correctly", async () => {
    const { baseElement, findByText } = rtlRouterRender(<CreatePolicy {...props} />, { route });
    await findByText(/Create Policy/i);
    await findByText(/Static Code Analysis/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("CreatePolicy --- RTL", () => {
  test("renders error message when fetching definitions failed", async () => {
    server.get(serviceUrl.getTemplates(), () => {
      return new Response(404, {}, { data: { status: 404 } });
    });
    const { findByText } = rtlRouterRender(<CreatePolicy {...props} />, { route });
    const errorMessage = await findByText("Oops, something went wrong.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("it is able to create policy only after adding a name", async () => {
    const { getByPlaceholderText, findByTestId, findByPlaceholderText } = rtlRouterRender(<CreatePolicy {...props} />, {
      route,
    });

    const createButton = await findByTestId("policy-header-affirmative-action");

    expect(createButton).toBeDisabled();
    await findByPlaceholderText(/name/i);
    const nameInput = getByPlaceholderText(/name/i);
    fireEvent.change(nameInput, { target: { value: "test" } });

    expect(createButton).toBeEnabled();
  });

  test("create button is disabled while creating", async () => {
    const { getByPlaceholderText, findByTestId, findByText, findByPlaceholderText } = rtlContextRouterRender(
      <CreatePolicy {...props} />,
      {
        route,
      }
    );

    const createButton = await findByTestId("policy-header-affirmative-action");
    await findByPlaceholderText(/name/i);
    const nameInput = getByPlaceholderText(/name/i);
    fireEvent.change(nameInput, { target: { value: "test" } });
    expect(createButton).toBeEnabled();

    fireEvent.click(createButton);
    expect(await findByText(/Create Policy/)).toBeInTheDocument();
  });
});
