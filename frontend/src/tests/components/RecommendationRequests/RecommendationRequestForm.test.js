// frontend/src/tests/components/RecommendationRequests/RecommendationRequestForm.test.js

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
      </Router>
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
      </Router>
    );
    // id field
    await screen.findByTestId("RecommendationRequestForm-id");
    expect(screen.getByText(/ID/)).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestForm-id")).toHaveValue("1");

    // other fields are pre-filled from defaultValues
    const reqEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
    const profEmail = screen.getByTestId("RecommendationRequestForm-professorEmail");
    const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
    const dateReq = screen.getByTestId("RecommendationRequestForm-dateRequested");
    const dateNeed = screen.getByTestId("RecommendationRequestForm-dateNeeded");
    const doneCheckbox = screen.getByTestId("RecommendationRequestForm-done");

    expect(reqEmail).toHaveValue(recommendationRequestsFixtures.oneRequest.requesterEmail);
    expect(profEmail).toHaveValue(recommendationRequestsFixtures.oneRequest.professorEmail);
    expect(explanation).toHaveValue(recommendationRequestsFixtures.oneRequest.explanation);
    expect(dateReq).toHaveValue(recommendationRequestsFixtures.oneRequest.dateRequested);
    expect(dateNeed).toHaveValue(recommendationRequestsFixtures.oneRequest.dateNeeded);
    // done is false in the fixture
    expect(doneCheckbox).not.toBeChecked();
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    // locate all fields
    const requesterEmailField = await screen.findByTestId(
      "RecommendationRequestForm-requesterEmail"
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail"
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested"
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded"
    );
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    // feed them all bad values
    fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
    fireEvent.change(professorEmailField, { target: { value: "also-bad" } });
    fireEvent.change(dateRequestedField, { target: { value: "bad-date" } });
    fireEvent.change(dateNeededField, { target: { value: "bad-date" } });
    fireEvent.click(submitButton);

    // both emails should hit the pattern error
    const emailErrors = await screen.findAllByText(/Must be a valid email address\./);
    expect(emailErrors).toHaveLength(2);

    // both dates should hit the ISO‐format pattern
    const isoErrors = screen.getAllByText(/Must be in ISO datetime format\./);
    expect(isoErrors).toHaveLength(2);
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    const submitButton = await screen.findByTestId("RecommendationRequestForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/Requester email is required\./);
    expect(screen.getByText(/Professor email is required\./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required\./)).toBeInTheDocument();
    expect(screen.getByText(/Date requested is required\./)).toBeInTheDocument();
    expect(screen.getByText(/Date needed is required\./)).toBeInTheDocument();
  });

  test("Explanation maxLength validation", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    const explanationField = await screen.findByTestId("RecommendationRequestForm-explanation");
    fireEvent.change(explanationField, {
      target: { value: "x".repeat(300) },
    });
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    await screen.findByText(/Explanation cannot exceed 255 characters\./);
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();
    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>
    );
    // fill in valid values
    fireEvent.change(await screen.findByTestId("RecommendationRequestForm-requesterEmail"), {
      target: { value: "student@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-professorEmail"), {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-explanation"), {
      target: { value: "OK explanation" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-dateRequested"), {
      target: { value: "2022-04-20T12:00:00" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-dateNeeded"), {
      target: { value: "2022-05-01T00:00:00" },
    });

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));
    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    // no validation errors linger
    expect(screen.queryByText(/required\./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Must be a valid email address\./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Must be in ISO datetime format\./)).not.toBeInTheDocument();
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    fireEvent.click(await screen.findByTestId("RecommendationRequestForm-cancel"));
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
