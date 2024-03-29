import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

const useNotifications = (userId?: string) => {

  const url = userId ? `/api/notifications/${userId}` : null;
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