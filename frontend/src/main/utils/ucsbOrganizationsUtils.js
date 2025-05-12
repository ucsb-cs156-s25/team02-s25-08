import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/ucsborganizations",
    method: "DELETE",
    params: {
      orgCode: cell.row.values.orgCode,
    },
  };
}
