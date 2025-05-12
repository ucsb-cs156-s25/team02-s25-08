import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return { __esModule: true, ...originalModule, toast: (x) => mockToast(x) };
});

describe("UCSBOrganizationsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "UCSBOrganizationsTable";

  const setupUser = (admin = false) => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(
        200,
        admin
          ? apiCurrentUserFixtures.adminUser
          : apiCurrentUserFixtures.userOnly,
      );
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("shows create button for admin user", async () => {
    setupUser(true);
    axiosMock.onGet("/api/ucsborganizations/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Create UCSB Organization/)).toBeInTheDocument(),
    );
    const btn = screen.getByText(/Create UCSB Organization/);
    expect(btn).toHaveAttribute("href", "/ucsborganizations/create");
  });

  test("renders three orgs for ordinary user", async () => {
    setupUser(false);
    axiosMock
      .onGet("/api/ucsborganizations/all")
      .reply(200, ucsbOrganizationsFixtures.threeUCSBOrganizations);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
      ).toHaveTextContent("ZPR"),
    );
    expect(
      screen.queryByText("Create UCSB Organization"),
    ).not.toBeInTheDocument();
  });

  test("handles backend timeout", async () => {
    setupUser(false);
    axiosMock.onGet("/api/ucsborganizations/all").timeout();
    const restore = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );
    expect(console.error.mock.calls[0][0]).toMatch(
      "Error communicating with backend via GET on /api/ucsborganizations/all",
    );
    restore();
  });

  test("delete action for admin", async () => {
    setupUser(true);
    axiosMock
      .onGet("/api/ucsborganizations/all")
      .reply(200, ucsbOrganizationsFixtures.threeUCSBOrganizations);
    axiosMock
      .onDelete("/api/ucsborganizations")
      .reply(200, "UCSB Organization with id ZPR was deleted");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
      ).toHaveTextContent("ZPR"),
    );

    const delBtn = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    fireEvent.click(delBtn);

    await waitFor(() => expect(mockToast).toHaveBeenCalled());
    expect(axiosMock.history.delete[0].params).toEqual({ orgCode: "ZPR" });
  });
});
