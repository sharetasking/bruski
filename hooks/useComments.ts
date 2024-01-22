
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
export function useComments (params?:
      {postId?: string,
        take?: number,
        page?:number
        orderBy?: string,
      }) {


  interface Comment {
    id: string;
    postId: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    [key: string]: any;

  }

  const postId = params?.postId ?? null;
  const take = params?.take ?? null;
  const page = params?.page ?? 1;
  const orderBy = params?.orderBy ?? null;


  let queries = [];

  let base_url = '/api/comments';

  if(postId) 
    queries.push(`postId=${postId}`);
  if(take)
    queries.push(`take=${take}`);
  if(page)
    queries.push(`page=${page}`);
  if(orderBy)
    queries.push(`orderBy=${orderBy}`);

  let url = base_url+'?'+queries.join('&');

  const { data, error, mutate } = useSWR(url, fetcher)
  const isLoading = !data && !error;
 
  return {
    data,
    isLoading,
    isError: error,
    mutate
  }


  
}
