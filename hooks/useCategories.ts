import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import { nullable } from 'zod'

export function useCategories() {
;
  const { data, error, isLoading, mutate } = useSWR(`/api/categories`, fetcher)
 
  if(!data) return {};

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}