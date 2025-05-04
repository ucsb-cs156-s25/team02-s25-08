import { toast } from "react-toastify";

const articleUtils = {
  url: "/api/articles",
};

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/articles",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}

export { articleUtils };
