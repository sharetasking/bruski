import useSWR from 'swr';

import fetcher from '@/lib/fetcher';

export function usePixi () {


  const url = '/api/posts/'
  const { data, error, mutate } = useSWR(url, fetcher);

  const isLoading = !data && !error;

  return {
    data,
    isLoading,
    isError: error,
    mutate, // include mutate in the return object
  };
}

