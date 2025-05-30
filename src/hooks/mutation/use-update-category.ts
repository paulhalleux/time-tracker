import { useMutation } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { CategoryService } from "../../services/category-service.ts";
import type { CreateTrackerCategoryDto } from "../../types/tracker.ts";

type UseUpdateCategoryArgs = {
  id: string;
  category: CreateTrackerCategoryDto;
};

/**
 * Custom hook to update an existing category.
 */
export function useUpdateCategory() {
  return useMutation({
    mutationFn: async ({ id, category }: UseUpdateCategoryArgs) => {
      await CategoryService.update(id, category);
    },
    meta: {
      refreshQueries: {
        queryKey: QueryKeys.Categories.All,
      },
    },
  });
}
