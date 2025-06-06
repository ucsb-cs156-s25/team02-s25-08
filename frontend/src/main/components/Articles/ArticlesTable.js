import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/articlesUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function ArticlesTable({
  articles,
  currentUser,
  testIdPrefix = "ArticlesTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/articles/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/articles/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "URL",
      accessor: "url",
    },
    {
      Header: "Explanation",
      accessor: "explanation",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Date Added",
      accessor: "dateAdded",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return <OurTable data={articles} columns={columns} testid={testIdPrefix} />;
}
