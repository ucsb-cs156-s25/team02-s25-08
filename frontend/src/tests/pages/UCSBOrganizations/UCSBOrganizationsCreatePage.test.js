import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

// Mock toast
const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const original = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...original,
    toast: (msg) => mockToast(msg),
  };
});

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Org Code")).toBeInTheDocument();
    });
  });

  test("on submit, makes request and navigates to /ucsborganizations", async () => {
    const newOrg = {
      id: 4,
      orgCode: "ACM",
      orgTranslationShort: "Association Comp Machine",
      orgTranslation: "Association of Computing Machinery",
      inactive: true,
    };

    axiosMock.onPost("/api/ucsborganizations/post").reply(202, newOrg);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByLabelText("Org Code"), {
      target: { value: newOrg.orgCode },
    });
    fireEvent.change(screen.getByLabelText("Org Translation Short"), {
      target: { value: newOrg.orgTranslationShort },
    });
    fireEvent.change(screen.getByLabelText("Org Translation"), {
      target: { value: newOrg.orgTranslation },
    });

    const inactiveCheckbox = screen.getByLabelText("Inactive");
    if (!inactiveCheckbox.checked) {
      fireEvent.click(inactiveCheckbox);
    }

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: newOrg.orgCode,
      orgTranslationShort: newOrg.orgTranslationShort,
      orgTranslation: newOrg.orgTranslation,
      inactive: newOrg.inactive,
    });

    expect(mockToast).toHaveBeenCalledWith(
      "New organization Created - id: 4 orgCode: ACM",
    );

    expect(mockNavigate).toHaveBeenLastCalledWith({ to: "/ucsborganizations" });
  });
});
