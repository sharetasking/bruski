import useSWR from 'swr';
import { Profile } from '@prisma/client'


import fetcher from '@/lib/fetcher';
import { BruskiProfile } from './useProfile';

export interface BruskiUser {
  id: string;
  name?: string;
  email: string|null;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
  profiles?: BruskiProfile[]

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