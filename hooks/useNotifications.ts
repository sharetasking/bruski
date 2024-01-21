import useSWR from 'swr';

import fetcher from '@/lib/fetcher';

const useNotifications = (userId?: string) => {

  // console.log('userId', userId);
  const url = userId ? `/api/notifications/${userId}` : null;
  const { data, error, mutate } = useSWR(url, fetcher);

  console.log('data', data);
  console.log('error', error);
  console.log(url)
  // isLoading is true when there's no data and no error
  const isLoading = !data && !error;

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useNotifications;