import { auth, redirectToSignIn, useUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { currentUser } from "@clerk/nextjs";
import PostPage from "@/components/pages/PostPage";

interface PostPageProps {
  params: {
    postId: string;
  };
}

// get comments

const postPage = async ({params}:PostPageProps ) => {
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isCommenting, setIsCommenting] = useState(false);
  // const [isComment, setIsComment] = useState(false);
  // const [commentBody, setCommentBody] = useState('');
  // const [commentId, setCommentId] = useState('');
  // const [commentUsername, setCommentUsername] = useState('');
  // const [commentUserId, setCommentUserId] = useState('');
  // const [commentCreatedAt, setCommentCreatedAt] = useState('');
  // const [commentUpdatedAt, setCommentUpdatedAt] = useState('');
  // const [commentLikes, setCommentLikes] = useState('');
  // const [commentDislikes, setCommentDislikes] = useState('');
  // const [commentLikesCount, setCommentLikesCount] = useState('');
  // const [commentDislikesCount, setCommentDislikesCount] = useState('');
  // const [commentCommentsCount, setCommentCommentsCount] = useState('');
  // const [commentComments, setCommentComments] = useState('');
  // const [commentIsLiked, setCommentIsLiked] = useState(false);
  // const [commentIsDisliked, setCommentIsDisliked] = useState(false);
  // const [commentIsMine, setCommentIsMine] = useState(false);
  // const [commentIsEdited, setCommentIsEdited] = useState(false);
  // const [commentIsDeleted, setCommentIsDeleted] = useState(false);
  // const [commentIsReply, setCommentIsReply] = useState(false);
  // const [commentReplyUsername, setCommentReplyUsername] = useState('');
  // const [commentReplyUserId, setCommentReplyUserId] = useState('');
  // const [commentReplyId, setCommentReplyId] = useState('');
  // const [commentReplyBody, setCommentReplyBody] = useState('');
  // const [commentReplyCreatedAt, setCommentReplyCreatedAt] = useState('');
  // const [commentReplyUpdatedAt, setCommentReplyUpdatedAt] = useState('');
  // const [commentReplyLikes, setCommentReplyLikes] = useState('');
  // const [commentReplyDislikes, setCommentReplyDislikes] = useState('');
  // const [commentReplyLikesCount, setCommentReplyLikesCount] = useState('');
  // const [commentReplyDislikesCount, setCommentReplyDislikesCount] = useState('');
  // const [commentReplyCommentsCount, setCommentReplyCommentsCount] = useState('');
  // const [commentReplyComments, setCommentReplyComments] = useState('');
  // const [commentReplyIsLiked, setCommentReplyIsLiked] = useState(false);
  // const [commentReplyIsDisliked, setCommentReplyIsDisliked] = useState(false);
  // const [commentReplyIsMine, setCommentReplyIsMine] = useState(false);
  // const [commentReplyIsEdited, setCommentReplyIsEdited] = useState(false);

  // const [post, setPost] = useState('');
  // const [username, setUsername] = useState('');
  // const [userId, setUserId] = useState('');
  // const [createdAt, setCreatedAt] = useState('');
  // const [updatedAt, setUpdatedAt] = useState('');
  // const [likes, setLikes] = useState('');

  // const [dislikes, setDislikes] = useState('');
  // const [likesCount, setLikesCount] = useState('');
  // const [dislikesCount, setDislikesCount] = useState('');
  // const [commentsCount, setCommentsCount] = useState('');
  // const [comments, setComments] = useState('');

  // const [isLiked, setIsLiked] = useState(false);
  // const [isDisliked, setIsDisliked] = useState(false);
  // const [isMine, setIsMine] = useState(false);
  // const [isEdited, setIsEdited] = useState(false);
  // const [isDeleted, setIsDeleted] = useState(false);

  // const [isReply, setIsReply] = useState(false);
  // const [replyUsername, setReplyUsername] = useState('');
  // const [replyUserId, setReplyUserId] = useState('');


const clerkUser = await currentUser();
if(!clerkUser) {
  redirectToSignIn();

}
const user = await prismadb.user.findFirst({
  include: {
    profiles: true
  },
  where: {
    clerkUserId: clerkUser?.id ?? ""
  }

});

// get post
const post = await prismadb.post.findFirst({
  include: {
    poster: true,
    originalPost: {
      include: {
        poster: true,
      }
    },
  },
  where: {
    id: params.postId
}});

const comments = await prismadb.post.findMany({
  where: {
    postType: 'COMMENT',
    originalPostId: params.postId
  },
  include: {
    poster: true,
    // comments: true,
    originalPost: {
      include: {
        poster: true,
      }
    },
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 30
});




// await prismadb.post.findMany({
  // take: 30,
//   where: {
//     isAReplyToId: params.postId
// }});


if(!post) {
  console.log('post not found')
  return <div>Post not found</div>
}
else
{
  return <PostPage user={user} post={post} comments={comments} />

}

};

export default postPage;