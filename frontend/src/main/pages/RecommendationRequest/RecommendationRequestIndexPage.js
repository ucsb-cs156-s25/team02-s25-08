import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from "main/components/RecommendationRequests/RecommendationRequestTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function RecommendationRequestIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: recommendationRequests,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/recommendationrequest/all"],
    { method: "GET", url: "/api/recommendationrequest/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/recommendationrequest/create"
          style={{ float: "right" }}
        >
          Create Recommendation Request
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Recommendation Requests</h1>
        <RecommendationRequestTable
          /** pass as `requests` not `recommendationRequests` **/
          requests={recommendationRequests}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
