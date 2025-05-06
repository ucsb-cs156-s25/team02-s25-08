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
    navigate(`/UCSBOrganizations/edit/${cell.row.values.id}`);
  };

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsborganizations/all"],
  );

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
      Header: "Inactive",
      accessor: "inactive",
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
