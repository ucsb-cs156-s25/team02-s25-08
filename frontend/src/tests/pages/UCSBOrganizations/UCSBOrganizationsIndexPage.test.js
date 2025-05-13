import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  const original = jest.requireActual("react-toastify");
  return { __esModule: true, ...original, toast: (x) => mockToast(x) };
});

describe("UCSBOrganizationsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "UCSBOrganizationsTable";

  const setupUser = (isAdmin = false) => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(
        200,
        isAdmin
          ? apiCurrentUserFixtures.adminUser
          : apiCurrentUserFixtures.userOnly,
      );
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("shows Create button for admin user", async () => {
    setupUser(true);
    axiosMock.onGet("/api/ucsborganizations/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const button = await screen.findByText(/Create UCSB Organization/);
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/ucsborganizations/create");
    expect(button).toHaveStyle("float: right;");
  });

  test("renders three orgs for regular user with no Create/Delete/Edit", async () => {
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

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).toHaveTextContent("ZPR");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgCode`),
    ).toHaveTextContent("KRC");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-orgCode`),
    ).toHaveTextContent("OSLI");

    expect(
      screen.queryByText(/Create UCSB Organization/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).not.toBeInTheDocument();
  });

  test("renders empty table with console error on timeout", async () => {
    setupUser(false);
    axiosMock.onGet("/api/ucsborganizations/all").timeout();
    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findAllByText("UCSB Organizations");

    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toMatch(
      "Error communicating with backend via GET on /api/ucsborganizations/all",
    );
    restoreConsole();
  });

  test("admin can delete an org and toast shows message", async () => {
    setupUser(true);
    axiosMock
      .onGet("/api/ucsborganizations/all")
      .reply(200, ucsbOrganizationsFixtures.threeUCSBOrganizations);
    axiosMock
      .onDelete("/api/ucsborganizations")
      .reply(200, { message: "UCSB Organization with id ZPR was deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const delBtn = await screen.findByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(delBtn);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        message: "UCSB Organization with id ZPR was deleted",
      });
    });

    expect(axiosMock.history.delete.length).toBe(1);
    expect(axiosMock.history.delete[0].params).toEqual({ orgCode: "ZPR" });
  });
});
