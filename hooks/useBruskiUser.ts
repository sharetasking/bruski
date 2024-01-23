import useSWR from 'swr';


import fetcher from '@/lib/fetcher';

export interface BruskiUser {
  id: string;
  name?: string;
  email: string|null;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
  profiles?: any[]

}
const useBruskiUser = () => {
  const { data, error, isLoading, mutate} = useSWR<BruskiUser>('/api/current', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useBruskiUser;