// frontend/src/tests/components/RecommendationRequests/RecommendationRequestTable.test.js

import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { recommendationRequestsFixtures } from "fixtures/recommendationRequestFixtures";
import RecommendationRequestTable from "main/components/RecommendationRequests/RecommendationRequestTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestTable tests", () => {
  const queryClient = new QueryClient();
  const testId = "RecommendationRequestTable";
  const expectedHeaders = [
    "ID",
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Date Requested",
    "Date Needed",
    "Done?"
  ];
  const expectedFields = [
    "id",
    "requesterEmail",
    "professorEmail",
    "explanation",
    "dateRequested",
    "dateNeeded",
    "done"
  ];

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestsFixtures.fourRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // headers
    expectedHeaders.forEach(h => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });

    // fields in first row
    expectedFields.forEach(field => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${field}`)
      ).toBeInTheDocument();
    });

    // check some cell values
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-id`)
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-id`)
    ).toHaveTextContent("2");

    // ordinary user: no edit/delete buttons
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`)
    ).not.toBeInTheDocument();
  });

  test("Has the expected column headers and content for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestsFixtures.fourRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // headers
    expectedHeaders.forEach(h => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });

    // fields in first row
    expectedFields.forEach(field => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${field}`)
      ).toBeInTheDocument();
    });

    // check some cell values
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-id`)
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-id`)
    ).toHaveTextContent("2");

    // admin user: edit & delete buttons present
    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestsFixtures.fourRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // wait for data
    await waitFor(() =>
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`)
      ).toHaveTextContent("1")
    );

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/recommendationrequests/edit/1"
      )
    );
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/recommendationrequests")
      .reply(200, { message: "Deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestsFixtures.fourRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // wait for data
    await waitFor(() =>
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`)
      ).toHaveTextContent("1")
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
