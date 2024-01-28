import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

const useNotifications = ({userId, type, take=4}:{userId?: string, type?:string, take?:number}) => {

  let url = userId ? `/api/pixis` : `/api/pixis`;

  url += `?take=${take}`;

  const { data, error, mutate } = useSWR(url, fetcher);

  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useNotifications;