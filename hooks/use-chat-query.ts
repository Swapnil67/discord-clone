import { useSocket } from '@/components/providers/socket-provider'
import { useInfiniteQuery } from '@tanstack/react-query'
import qs from 'query-string'

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId"
  paramValue: string;
}

export const useChatQuery = (props: ChatQueryProps) => {
  const { queryKey, apiUrl, paramKey, paramValue } = props;
  const { isConnected } = useSocket();
  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue
      }
    }, { skipNull: true })

    const res = await fetch(url);
    return res.json();
  }

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: undefined,
  })

  return {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  }
}