import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningComonsMenuItemForm from "main/components/UCSBDiningComonsMenuItem/UCSBDiningComonsMenuItemForm";
import { ucsbDiningComonsMenuItemFixtures } from "fixtures/ucsbDiningComonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningComonsMenuItemForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningComonsMenuItemForm />
      </Router>,
    );
    await screen.findByText(/Dining Commons Code/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a UCSBDiningCommonsMenuItem", async () => {
    render(
      <Router>
        <UCSBDiningComonsMenuItemForm initialContents={ucsbDiningComonsMenuItemFixtures.oneDiningCommonsMenuItem} />
      </Router>,
    );
    await screen.findByTestId(/UCSBDiningCommonsMenuItem-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBDiningCommonsMenuItem-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <UCSBDiningComonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningComonsMenuItemForm-diningCommonsCode");
    const diningCommonsCodeField = screen.getByTestId("UCSBDiningComonsMenuItemForm-diningCommonsCode");
    const stationField = screen.getByTestId("UCSBDiningComonsMenuItemForm-station");
    const submitButton = screen.getByTestId("UCSBDiningComonsMenuItemForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "bad-input" } });
    fireEvent.change(stationField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/DiningCommonsCode must be in the format of a string/);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningComonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningComonsMenuItemForm-submit");
    const submitButton = screen.getByTestId("UCSBDiningComonsMenuItemForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/DiningCommonsCode is required./);
    expect(screen.getByText(/Name is required./)).toBeInTheDocument();
    expect(screen.getByText(/Station is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBDiningComonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningComonsMenuItemForm-diningCommonsCode");

    const diningCommonsCodeField = screen.getByTestId("UCSBDiningComonsMenuItemForm-diningCommonsCode");
    const nameField = screen.getByTestId("UCSBDiningComonsMenuItemForm-name");
    const stationField = screen.getByTestId("UCSBDiningComonsMenuItemForm-station");
    const submitButton = screen.getByTestId("UCSBDiningComonsMenuItemForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "SampleDcCode" } });
    fireEvent.change(nameField, { target: { value: "Portola" } });
    fireEvent.change(stationField, { target: { value: "International" }, });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/DiningCommonsCode must be in the format of a string/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Station must be in the format of a string/),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningComonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningComonsMenuItemForm-cancel");
    const cancelButton = screen.getByTestId("UCSBDiningComonsMenuItemForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
