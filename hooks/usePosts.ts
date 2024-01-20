import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
export function usePosts (params?:{profileId?: string, take?: number, skip?: number, orderBy?: string, fresh?: boolean, page?:number}) {

  
  
  interface Post {
    id: string;
    profileId: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    [key: string]: any;

  }

  const profileId = params?.profileId ?? null;
  const take = params?.take ?? null;
  const page = params?.page ?? 1;
  const skip = params?.skip ?? null;
  
  // const {
  //       take,
  //       skip,
  //       orderBy,
  //       fresh,
  //       page=1} = params;



  const url = profileId ? `/api/posts?profileId=${profileId}` : '/api/posts';
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
 
  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}



// export const usePosts =  (userId?: string) => {

//   const fetcher = (url: string) => fetch(url).then((res) => res.json());
//   const url = userId ? `/api/posts?userId=${userId}` : '/api/posts';



//   const { data, error, isLoading,mutate } = useSWR(url, fetcher)
 
//   if (error) return "failed to load"
//   if (isLoading) return  "loading..."
 
//   // render data
//   return data.name



  // const results = useSWR(url, fetcher);
  // const mutate = results

  // return (res);
//mutate
// return data;
  // // To determine if the request is loading, you can check if data and error are undefined
  // const isLoading = !data && !error;

  // const { data, error, isLoading, mutate } = useSWR(url, fetcher);


  // let res = await fetch(url, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //get posts from the api using axios
  

  // const getPosts = () => {
  //    let res = fetcher(url);
  //   return res;
  // }

  // return getPosts();
  

//   return {
//     data,
//     error,
//     mutate
//   }
// };

// export default usePosts;