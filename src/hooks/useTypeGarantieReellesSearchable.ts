import { useInfiniteQuery } from "@tanstack/react-query";
import { TypeGarantieReelleService } from "@/services/type-garantie-reelle.service";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { useMemo, useState } from "react";

export function useTypeGarantieReellesSearchable() {
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
    queryKey: ["type-garantie-reelles-searchable", search],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await TypeGarantieReelleService.getAll(apiClient);
      const allData = response.data || [];

      // Filtrer par recherche si nécessaire
      let filtered = allData;
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = allData.filter((item: any) =>
          item.TYPGAR_REEL_LIB?.toLowerCase().includes(searchLower) ||
          item.TYPGAR_REEL_CODE?.toLowerCase().includes(searchLower)
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
          value: item.TYPGAR_REEL_CODE || '',
          label: `${item.TYPGAR_REEL_CODE || ''} - ${item.TYPGAR_REEL_LIB || ''}`,
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


