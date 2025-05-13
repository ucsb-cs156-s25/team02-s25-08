import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const original = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...original,
    toast: (msg) => mockToast(msg),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...original,
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationsEditPage tests", () => {
  describe("when backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsborganizations", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form doesn't appear", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit Organization");
      expect(
        screen.queryByTestId("UCSBOrganizationsForm-orgCode"),
      ).not.toBeInTheDocument();

      restoreConsole();
    });
  });

  describe("when backend works normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsborganizations", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          orgCode: "ACM",
          orgTranslationShort: "Association Comp Machine",
          orgTranslation: "Association of Computing Machinery",
          inactive: false,
        });
      axiosMock.onPut("/api/ucsborganizations").reply(200, {
        id: 17,
        orgCode: "ACM1",
        orgTranslationShort: "Association Comp Machine1",
        orgTranslation: "Association of Computing Machinery1",
        inactive: true,
      });
    });

    const queryClient = new QueryClient();
    test("loads data and updates form", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationsForm-id");

      const orgCodeInput = screen.getByTestId("UCSBOrganizationsForm-orgCode");
      const shortInput = screen.getByLabelText("Org Translation Short");
      const translationInput = screen.getByLabelText("Org Translation");
      const inactiveInput = screen.getByLabelText("Inactive");
      const updateButton = screen.getByText("Update");

      expect(orgCodeInput).toHaveValue("ACM");
      expect(shortInput).toHaveValue("Association Comp Machine");
      expect(translationInput).toHaveValue(
        "Association of Computing Machinery",
      );
      expect(inactiveInput).not.toBeChecked();

      fireEvent.change(orgCodeInput, {
        target: { value: "ACM1" },
      });
      fireEvent.change(shortInput, {
        target: { value: "Association Comp Machine1" },
      });
      fireEvent.change(translationInput, {
        target: { value: "Association of Computing Machinery1" },
      });
      fireEvent.click(inactiveInput); // toggle to true
      fireEvent.click(updateButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Organization Updated - id: 17 orgCode: ACM1",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganizations" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
        orgCode: "ACM1",
        orgTranslationShort: "Association Comp Machine1",
        orgTranslation: "Association of Computing Machinery1",
        inactive: true,
      });
    });
  });
});
