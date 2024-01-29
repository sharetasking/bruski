import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import { BruskiPost } from './usePost';
export function usePosts (params?:{profileId?: string, take?: number, skip?: number, orderBy?: string, target?: string, fresh?: boolean, page?:number}) {

  

  const profileId = params?.profileId ?? null;
  const take = params?.take ?? 10;
  const page = params?.page ?? 1;
  const skip = params?.skip ?? null;
  
  // const {
  //       take,
  //       skip,
  //       orderBy,
  //       fresh,
  //       page=1} = params;

  let queries = [];


  let base_url = '/api/posts';

  if(params?.target)
    base_url = `/api/posts/${params?.target}`;



  if(profileId) 
    queries.push(`profileId=${profileId}`);
  if(take)
    queries.push(`take=${take}`);
  if(skip)
    queries.push(`skip=${skip}`);
  if(page)
    queries.push(`page=${page}`);
  if(params?.orderBy)
    queries.push(`orderBy=${params?.orderBy}`);
  if(params?.target)
    queries.push(`target=${params?.target}`);
  if(params?.fresh)
    queries.push(`fresh=${params?.fresh}`);

  let url = base_url+'?'+queries.join('&');
  console.log(url)

  const { data, error, mutate } = useSWR<BruskiPost[]>(url, fetcher)
  
  const isLoading = !data && !error;
 
  return {
    data:data as BruskiPost[],
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