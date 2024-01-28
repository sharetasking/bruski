import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

export const useFollowers = ({mode, take}:{mode:string, take:number}) =>
{

  const url="/api/followers?mode="+mode+"&take="+take
  const { data, error, mutate } = useSWR(url, fetcher)
  const isLoading = !data && !error;
 
  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}