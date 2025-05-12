import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationsForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Org Code",
    "Org Translation Short",
    "Org Translation",
  ];
  const testId = "UCSBOrganizationsForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationsForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly with initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationsForm
            initialContents={ucsbOrganizationsFixtures.oneUCSBOrganization}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByLabelText("Id")).toHaveValue(
      ucsbOrganizationsFixtures.oneUCSBOrganization.id.toString(),
    );
    expect(screen.getByLabelText("Org Code")).toHaveValue(
      ucsbOrganizationsFixtures.oneUCSBOrganization.orgCode,
    );
    expect(screen.getByLabelText("Org Translation Short")).toHaveValue(
      ucsbOrganizationsFixtures.oneUCSBOrganization.orgTranslationShort,
    );
    expect(screen.getByLabelText("Org Translation")).toHaveValue(
      ucsbOrganizationsFixtures.oneUCSBOrganization.orgTranslation,
    );
    expect(screen.getByLabelText("Inactive").checked).toBe(
      ucsbOrganizationsFixtures.oneUCSBOrganization.inactive,
    );
  });

  test("navigate(-1) is called on Cancel click", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationsForm />
        </Router>
      </QueryClientProvider>,
    );

    const cancelButton = await screen.findByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("validations work correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationsForm />
        </Router>
      </QueryClientProvider>,
    );

    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Org Code is required/)).toBeInTheDocument();
    expect(
      screen.getByText(/Org Translation Short is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Org Translation is required/)).toBeInTheDocument();

    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    fireEvent.change(orgCodeInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });
});
