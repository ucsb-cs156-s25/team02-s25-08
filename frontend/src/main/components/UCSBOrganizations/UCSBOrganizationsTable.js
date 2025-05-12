import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/ucsbOrganizationsUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationsTable({
  UCSBOrganizations,
  currentUser,
  testIdPrefix = "UCSBOrganizationsTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/ucsborganizations/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : backend mutation caching makes this hard to test
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsborganizations/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : mutation side effects difficult to verify
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Organization Code",
      accessor: "orgCode",
    },
    {
      Header: "Organization Translation Short",
      accessor: "orgTranslationShort",
    },
    {
      Header: "Organization Translation",
      accessor: "orgTranslation",
    },
    {
      // Stryker disable all
      Header: "Inactive",
      accessor: (row) => String(row.inactive),
      id: "inactive",
      // Stryker restore all
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return (
    <OurTable
      data={UCSBOrganizations}
      columns={columns}
      testid={testIdPrefix}
    />
  );
}
