import { useMutation } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { CategoryService } from "../../services/category-service.ts";

type UseDeleteCategoryArgs = {
  id: string;
};

/**
 * Custom hook to delete a category by its ID.
 */
export function useDeleteCategory() {
  return useMutation({
    mutationFn: async ({ id }: UseDeleteCategoryArgs) => {
      await CategoryService.delete(id);
    },
    meta: {
      refreshQueries: {
        queryKey: QueryKeys.Categories.All,
      },
    },
  });
}
