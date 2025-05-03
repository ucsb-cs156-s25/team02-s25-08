import { onDeleteSuccess, cellToAxiosParamsDelete, articleUtils } from "main/utils/articlesUtils";

describe("articlesUtils tests", () => {
  
  describe("onDeleteSuccess", () => {
    test("logs the message to console", () => {
      const consoleSpy = jest.spyOn(console, "log");
      const testMessage = "Article deleted successfully";
      onDeleteSuccess(testMessage);
      expect(consoleSpy).toHaveBeenCalledWith(testMessage);
      consoleSpy.mockRestore();
    });
    
    test("handles empty message", () => {
      const consoleSpy = jest.spyOn(console, "log");
      onDeleteSuccess("");
      expect(consoleSpy).toHaveBeenCalledWith("");
      consoleSpy.mockRestore();
    });

    test("handles null message", () => {
      const consoleSpy = jest.spyOn(console, "log");
      onDeleteSuccess(null);
      expect(consoleSpy).toHaveBeenCalledWith(null);
      consoleSpy.mockRestore();
    });
  });
  
  describe("cellToAxiosParamsDelete", () => {
    test("maps cell data correctly", () => {
      const cell = {
        row: {
          values: {
            id: 17
          }
        }
      };
      const result = cellToAxiosParamsDelete(cell);
      expect(result).toEqual({
        url: "/api/articles",
        method: "DELETE",
        params: {
          id: 17
        }
      });
    });

    test("handles missing id", () => {
      const cell = {
        row: {
          values: { }
        }
      };
      const result = cellToAxiosParamsDelete(cell);
      expect(result).toEqual({
        url: "/api/articles",
        method: "DELETE",
        params: {
          id: undefined
        }
      });
    });
  });

  describe("articleUtils", () => {
    test("has the correct URL", () => {
      expect(articleUtils.url).toBe("/api/articles");
    });
  });
});