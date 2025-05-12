import { toast } from "react-toastify";

// Stryker disable next-line all
export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}
// Stryker restore next-line all

export function cellToAxiosParamsDelete(cell) {
  return {
    // Stryker disable next-line all
    url: "/api/recommendationrequest",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}
// Stryker restore next-line all
