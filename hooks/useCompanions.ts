import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import { nullable } from 'zod'

export function useCompanions() {
  const { data, error, isLoading, mutate } = useSWR(`/api/companions`, fetcher)
  if(!data) return {};

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}