"use client";

import useNotifications from "@/hooks/useNotifications";
import useBruskiUser from "@/hooks/useBruskiUser";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import { timeAgo } from '@/lib/utils';

const NotificationsFeed = () => {
  const { data: currentUser, mutate: mutateCurrentUser } = useBruskiUser();
  const { isLoading = true, data: fetchedNotifications = [] } = useNotifications(currentUser?.id);

  

  if (fetchedNotifications.length === 0 && !isLoading) {
    return (
      <div className="text-neutral-600 text-center p-6 text-xl flex flex-col max-w-xl grow">
        No notifications
      </div>
    )
  }
  else if (isLoading) {
    return (
    <div className="text-neutral-600 text-center p-6 text-xl flex flex-col max-w-xl grow">
      Loading...
    </div>)
  }

  else
    return ( 
      <div className="flex flex-col lg:max-w-2xl grow p-4 inset-0 w-2xl">
        {fetchedNotifications.map((notification: Record<string, any>) => (
          <div key={notification.id} className="flex flex-row items-center p-6 gap-4 border-b-[1px] border-secondary">
            <Bell className="text-primary" size={32} />
            <p className="">
              <Link className="font-semibold hover:underline" href={"/"+notification?.initiator?.url}>{notification?.initiator?.display_name}</Link>
                &nbsp;<span className="text-primary/80">{notification.type=="COMMENT" ? "commented on your" : (notification.type=="LIKE" ? "liked your" : "followed you")}</span>{

                notification.type != "FOLLOW" && ( <>&nbsp;
                <Link className="font-semibold hover:underline" href={"/post/"+notification?.targetObjectId}>post</Link> </>)}
                <span className="text-primary/20 text-sm">&bull;</span> <span className="text-primary/60">{timeAgo(notification.createdAt)}</span>
                {
                  notification?.createdObjectId &&
                  <Link href={"/post/"+notification.createdObjectId} className="borderd bg-secondary rounded-2xl p-4 mt-2 text-sm w-full flex grow flex-1"> {notification?.body} </Link>
                }
                
                
            </p>
          </div>
          ))}
      </div>
    );
}
 
export default NotificationsFeed;