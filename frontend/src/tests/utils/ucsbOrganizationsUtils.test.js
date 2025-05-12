import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/ucsbOrganizationsUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return { __esModule: true, ...originalModule, toast: (x) => mockToast(x) };
});

describe("ucsboOrganizationsUtils", () => {
  describe("onDeleteSuccess", () => {
    test("logs and toasts the message", () => {
      const restore = mockConsole();
      onDeleteSuccess("abc");
      expect(mockToast).toHaveBeenCalledWith("abc");
      restore();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("builds correct axios params", () => {
      const cell = { row: { values: { orgCode: "ZPR" } } };
      const result = cellToAxiosParamsDelete(cell);
      expect(result).toEqual({
        url: "/api/ucsborganizations",
        method: "DELETE",
        params: { orgCode: "ZPR" },
      });
    });
  });
});
