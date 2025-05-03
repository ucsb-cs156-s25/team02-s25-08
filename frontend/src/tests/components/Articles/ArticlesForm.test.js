import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFictures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );

    expect(await screen.findByTestId("ArticlesForm-title")).toBeInTheDocument();
    expect(screen.getByText(/Create/)).toBeInTheDocument();
  });

  test("renders correctly when passing in an Article", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFictures.oneArticle} />
      </Router>,
    );

    expect(await screen.findByTestId("ArticlesForm-id")).toBeInTheDocument();
    expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
    expect(screen.getByTestId("ArticlesForm-title")).toHaveValue(
      "UCSB Researchers Develop New Quantum Computing Platform",
    );
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );

    expect(await screen.findByTestId("ArticlesForm-title")).toBeInTheDocument();
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(screen.getByTestId("ArticlesForm-url"), {
      target: { value: "not-a-url" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(submitButton);

    await screen.findByText(/URL must start with http:\/\/ or https:\/\//);
    expect(screen.getByText(/Invalid email address/)).toBeInTheDocument();
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );

    expect(
      await screen.findByTestId("ArticlesForm-submit"),
    ).toBeInTheDocument();
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Title is required/);
    expect(screen.getByText(/URL is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required/)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>,
    );

    expect(await screen.findByTestId("ArticlesForm-title")).toBeInTheDocument();

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, {
      target: { value: "Test Article" },
    });
    fireEvent.change(urlField, {
      target: { value: "https://test.org" },
    });
    fireEvent.change(explanationField, {
      target: { value: "Test explanation" },
    });
    fireEvent.change(emailField, {
      target: { value: "test@ucsb.edu" },
    });
    fireEvent.change(dateAddedField, {
      target: { value: "2024-02-01T12:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/URL must start with http:\/\/ or https:\/\//),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Invalid email address/)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );

    expect(
      await screen.findByTestId("ArticlesForm-cancel"),
    ).toBeInTheDocument();
    const cancelButton = screen.getByTestId("ArticlesForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("Correct error messages on invalid input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-title");
    const titleField = screen.getByTestId("ArticlesForm-title");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "bad-input" } });
    fireEvent.change(dateAddedField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Date Added is required/);
  });

  test("allows valid https URL", async () => {
    const mockSubmitAction = jest.fn();
    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>,
    );

    // Fill in all required fields to make the test pass
    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Test Title" } });
    fireEvent.change(urlField, { target: { value: "https://test.com" } });
    fireEvent.change(explanationField, {
      target: { value: "Test explanation" },
    });
    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(dateAddedField, { target: { value: "2024-02-01T12:00" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    expect(screen.queryByText(/URL must start/)).not.toBeInTheDocument();
  });

  test("rejects httpx as invalid", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    // Add a title to avoid other validation errors
    fireEvent.change(titleField, { target: { value: "Test Title" } });
    fireEvent.change(urlField, { target: { value: "httpx://bad.com" } });
    fireEvent.click(submitButton);

    await screen.findByText(/URL must start/);
  });
});
