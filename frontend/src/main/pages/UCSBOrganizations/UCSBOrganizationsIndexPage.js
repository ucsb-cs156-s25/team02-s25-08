import React from "react";
import { useBackend } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationsTable from "main/components/UCSBOrganizations/UCSBOrganizationsTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function UCSBOrganizationsIndexPage() {
  const currentUser = useCurrentUser();

  const { data: ucsborganizations } = useBackend(
    ["/api/ucsborganizations/all"],
    { method: "GET", url: "/api/ucsborganizations/all" },
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsborganizations/create"
          style={{ float: "right" }}
        >
          Create UCSB Organization
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSBOrganizations</h1>
        <UCSBOrganizationsTable
          ucsborganizations={ucsborganizations}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
