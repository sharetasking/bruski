import useSWR from 'swr';
import { Profile } from '@prisma/client'

import fetcher from '@/lib/fetcher';


export interface BruskiProfile extends Profile {
  isFollowed?: boolean;
}


const useProfiles = (profileId?: string) => {
  // const { data, error, mutate } = useSWR(profileId ? `/api/profiles/${profileId}` : null, fetcher);
  let url = '/api/profiles/'

  url = profileId ? `/api/profile/${profileId}` : '/api/profiles';

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);


  return {
    data,
    isError: error,
    isLoading, // include mutate in the return object
    mutate
  };
};

export default useProfiles;