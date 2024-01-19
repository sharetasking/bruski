import useSWR from 'swr';

import fetcher from '@/lib/fetcher';

//interface for the data returned
export interface ExtendedProfile {
  id: string;
  display_name: string|null;
  img: string|null;
  listOfProfilesFollowingViewedProfile?: {
    followerId: string;
    followeeId: string;
  }[];
  listOfProfilesFollowedByViewedProfile?: {
    followerId: string;
    followeeId: string;
  }[];
  isFollowedByUser?: boolean;
  isFollowingUser?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  [key: string]: any;
}
const useProfiles = ({profileId, take}:{profileId?:string, take:number, fresh?:boolean}) => {
  
  // const { data, error, mutate } = useSWR(profileId ? `/api/profiles/${profileId}` : null, fetcher);
  let url = '/api/profiles/'

  url = profileId ? `/api/profiles/${profileId}` : '/api/profiles';
  url = take ? `/api/profiles?take=${take}` : '/api/profiles';

  // const { data, error, isLoading, mutate }:{ data:ExtendedProfile, error:string, isLoading:boolean, mutate:function } = useSWR(url, fetcher);

  const  { data, error, isLoading, mutate } = useSWR<ExtendedProfile[], string>(url, fetcher);
  

  return {
    data,
    isError: error,
    isLoading,
    mutate // include mutate in the return object
  };
};

export default useProfiles;