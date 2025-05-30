import { skipToken, useQuery } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { CategoryService } from "../../services/category-service.ts";

type UseQueryCategoryParams = {
  id: string | undefined;
};

/**
 * Custom hook to fetch a category by its ID.
 *
 * @param {UseQueryCategoryParams} params - The parameters for the query.
 * @param {string} params.id - The ID of the category to fetch.
 * @return The query result containing the category data.
 */
export function useQueryCategory({ id }: UseQueryCategoryParams) {
  return useQuery({
    queryKey: QueryKeys.Categories.ById(id),
    queryFn: !id ? skipToken : () => CategoryService.read(id),
    enabled: !!id,
  });
}
