import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("OrgCode")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /ucsborganizations", async () => {
    const ucsborganization = {
      orgCode: "ACM",
      orgTranslationShort: "Association Comp Machine",
      orgTranslation: "Association of Computing Machinery",
      inactive: "false",
    };

    axiosMock
      .onPost("/api/ucsborganizations/post")
      .reply(202, ucsborganization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("OrgCode")).toBeInTheDocument();
    });

    const orgCodeInput = screen.getByLabelText("OrgCode");
    const orgTranslationShortInput = screen.getByLabelText("OrgTranslationShort");
    const orgTranslationInput = screen.getByLabelText("OrgTranslation");
    const inactiveInput = screen.getByLabelText("Inactive");
    const createButton = screen.getByText("Create");

    fireEvent.change(orgCodeInput, { target: { value: "ACM" } });
    fireEvent.change(orgTranslationShortInput, {
      target: { value: "Association Comp Machine" },
    });
    fireEvent.change(orgTranslationInput, {
      target: { value: "Association of Computing Machinery" },
    });
    fireEvent.change(inactiveInput, { target: { value: "false" } }); // string value

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "ACM",
      orgTranslationShort: "Association Comp Machine",
      orgTranslation: "Association of Computing Machinery",
      inactive: "false", // match teacher's string version
    });

    expect(mockToast).toHaveBeenCalledWith(
      "New organization Created - OrgCode: ACM OrgTranslationShort: Association Comp Machine OrgTranslation: Association of Computing Machinery Inactive: false"
    );
    expect(mockNavigate).toHaveBeenLastCalledWith({ to: "/ucsborganizations" });
  });
});
