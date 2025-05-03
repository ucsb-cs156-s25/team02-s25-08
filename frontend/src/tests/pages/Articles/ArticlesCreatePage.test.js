import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {
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
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const article = {
      id: 3,
      title: "New CS Article",
      url: "https://www.cs.ucsb.edu/article1",
      explanation: "New research in Computer Science",
      email: "researcher@ucsb.edu",
      dateAdded: "2024-02-01T12:00"
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId("ArticlesForm-title");
    const urlInput = screen.getByTestId("ArticlesForm-url");
    const explanationInput = screen.getByTestId("ArticlesForm-explanation");
    const emailInput = screen.getByTestId("ArticlesForm-email");
    const dateAddedInput = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleInput, { target: { value: "New CS Article" } });
    fireEvent.change(urlInput, { target: { value: "https://www.cs.ucsb.edu/article1" } });
    fireEvent.change(explanationInput, { target: { value: "New research in Computer Science" } });
    fireEvent.change(emailInput, { target: { value: "researcher@ucsb.edu" } });
    fireEvent.change(dateAddedInput, { target: { value: "2024-02-01T12:00" } });
    
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "New CS Article",
      url: "https://www.cs.ucsb.edu/article1",
      explanation: "New research in Computer Science",
      email: "researcher@ucsb.edu",
      dateAdded: "2024-02-01T12:00"
    });

    expect(mockToast).toBeCalledWith(
      "New article Created - id: 3 title: New CS Article"
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });
  });
});
