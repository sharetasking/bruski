import useSWR from 'swr';

import fetcher from '@/lib/fetcher';

export function usePost (postId: string) {


  const url = '/api/posts/'+postId;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

 
  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}

