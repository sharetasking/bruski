import useSWR from 'swr';

import fetcher from '@/lib/fetcher';
import { Profile, MediaType, Category } from 'prisma/prisma-client'

export interface BruskiPost {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  profileId: string;
  media: string[];
  mediaType: MediaType|null; // Assuming MediaType is an enum or type defined elsewhere
  num_comments: number;
  num_likes: number;
  num_bookmarks: number;
  categoryId?: string|null;
  date_deleted?: Date|null;
  
  // Assuming Profile, Category, PostType, PostLike, Bookmark are defined elsewhere
  poster: Profile;
  category?: Category|null;
  // postType: PostType;
  originalPostId?: string|null;
  originalPost?: BruskiPost|null; // Reference to original post, assuming it's of the same type

  // Lists
  // likeList: PostLike[];
  // bookmarksReceivedList: Bookmark[];
  // comments: BruskiPost[]; // Assuming comments are also BruskiPosts

  // Relations for rebrews
  rebrewedByProfile?: Profile|null;
  rebrewedById?: string|null;
  originalPostByProfile?: Profile|null;
  originalPostById?: string|null;
}

export function usePost (postId: string) {


  const url = '/api/posts/'+postId;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

 
  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}

