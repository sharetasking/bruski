"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";


interface AvatarProps {
  img: string,
  url?: string,
  hasBorder?: boolean;
  size?: number|undefined;
  className?: string;
  profileId?: string;
  // isLarge?: boolean;
  onClick?: (event: any) => void;
}

const Avatar: React.FC<AvatarProps> = ({img, url, size, hasBorder, className, onClick }) => {
  const router = useRouter();

  const _img = img ?? '/img/placeholder.svg';
  return (
    <div
      className={`
        ${hasBorder ? 'gradient-border' : ''}
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
      onClick={onClick}
    >
      
        <Image
          style={{
            objectFit: 'cover',
            borderRadius: '100%'
          }}
          fill
          className="rounded-full flex inset-0 m-auto"
          sizes="96px"
          // sizes={size ? ''+size+'px' : '96px'}
          alt="Avatar"
          // onClick={onClick}
          src={_img ?? '/img/placeholder.svg'}
        />
      {/* </Link> */}
    </div>
  );
}
 
export default Avatar;