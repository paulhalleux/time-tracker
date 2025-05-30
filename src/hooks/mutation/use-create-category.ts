import { useMutation } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { CategoryService } from "../../services/category-service.ts";
import type { CreateTrackerCategoryDto } from "../../types/tracker.ts";

type UseCreateCategoryArgs = {
  category: CreateTrackerCategoryDto;
};

/**
 * Custom hook to create a new category.
 */
export function useCreateCategory() {
  return useMutation({
    mutationFn: async ({ category }: UseCreateCategoryArgs) => {
      await CategoryService.create(category);
    },
    meta: {
      refreshQueries: {
        queryKey: QueryKeys.Categories.All,
      },
    },
  });
}
