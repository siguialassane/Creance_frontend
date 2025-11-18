import { useInfiniteQuery } from "@tanstack/react-query";
import { CiviliteService } from "@/services/civilite.service";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { useMemo, useState } from "react";

export function useCivilitesSearchable() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();
  const [search, setSearch] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["civilites-searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await CiviliteService.getAll(apiClient);
      const allData = response.data?.data || [];
      
      // Filtrer par recherche si nécessaire
      let filtered = allData;
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = allData.filter((item: any) =>
          item.CIV_LIB?.toLowerCase().includes(searchLower) ||
          item.CIV_CODE?.toLowerCase().includes(searchLower)
        );
      }
      
      // Pagination simple (20 items par page)
      const pageSize = 20;
      const start = pageParam * pageSize;
      const end = start + pageSize;
      const pageData = filtered.slice(start, end);
      
      return {
        items: pageData,
        nextPage: end < filtered.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    initialPageParam: 0,
  });

  const items = useMemo(() => {
    return (
      data?.pages
        .flatMap((page) => page.items)
        .map((item: any) => ({
          value: item.CIV_CODE || '',
          label: `${item.CIV_CODE || ''} - ${item.CIV_LIB || ''}`,
        })) || []
    );
  }, [data]);

  return {
    items,
    isLoading,
    hasMore: hasNextPage,
    loadMore: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    isFetchingMore: isFetchingNextPage,
    setSearch,
    search,
  };
}


