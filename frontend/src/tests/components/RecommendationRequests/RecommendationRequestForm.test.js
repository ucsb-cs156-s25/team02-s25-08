import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";
import { recommendationRequestsFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={recommendationRequestsFixtures.oneRequest}
        />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-id");
    expect(screen.getByText(/ID/)).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestForm-id")).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");

    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
    fireEvent.change(dateRequestedField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Must be a valid email address\./);
    await screen.findByText(/Date requested is required\./);
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-submit");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Requester email is required\./);
    expect(
      screen.getByText(/Professor email is required\./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required\./)).toBeInTheDocument();
    expect(
      screen.getByText(/Date requested is required\./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Date needed is required\./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");

    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      {
        target: { value: "student@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
      {
        target: { value: "prof@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-explanation"),
      {
        target: { value: "Application for honors program" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
      {
        target: { value: "2022-04-20T12:00" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
      {
        target: { value: "2022-05-01T15:30" },
      },
    );

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Requester email is required\./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Must be a valid email address\./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date requested is required\./),
    ).not.toBeInTheDocument();
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-cancel");
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-cancel"));
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
