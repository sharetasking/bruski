"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";


interface AvatarProps {
  img: String,
  url?: String,
  hasBorder?: boolean;
  size?: number|undefined;
  className?: string;
  profileId?: string;
  // isLarge?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({img, url, size, hasBorder, className }) => {
  const router = useRouter();

  const _img = img+"" ?? '/images/placeholder.png';
  const onClick = useCallback((event: any) => {
    event.stopPropagation();

    // const url = `/${url}`;

    router.push("/"+(url ?? ""));
  }, [router, url]);

  return (
    <div
      className={`
        ${hasBorder ? 'border-4 border-black' : ''}
        ${size ? 'w-'+size+' h-'+size : 'w-12 h-12'}
        rounded-full 
        hover:opacity-90 
        transition 
        cursor-pointer
        relative
        flex-0
        grow-0
        inset-0
        flex justify-center items-center
        shrink-0

      `+className}
    >
      <Image
        style={{
          objectFit: 'cover',
          borderRadius: '100%'
        }}
        fill
        className="rounded-full flex inset-0 m-auto"
        sizes={size ? ''+size+'px' : '96px'}
        alt="Avatar"
        onClick={onClick}
        src={_img ?? '/images/placeholder.png'}
      />
    </div>
  );
}
 
export default Avatar;