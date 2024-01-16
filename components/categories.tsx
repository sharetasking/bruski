"use client";

import qs from "query-string";
import { Category } from "@prisma/client"
import { useCategories } from "@/hooks/useCategories";
import { useRouter, useSearchParams } from "next/navigation";
import { HashLoader } from "react-spinners";
import { cn } from "@/lib/utils";


export const Categories = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");

  const {data, isLoading} = useCategories();

  //limit data to 5 elements
  
  const categories_truncated = data ? data.slice(0, 4) : null;


  const onClick = (id: string | undefined) => {
    const query = { categoryId: id };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query
    }, { skipNull: true });

    router.push(url);
  };


  if (isLoading) return <HashLoader color="#63636366" />

  return (
    <div className="w-full overflow-x-auto gap-2 flex flex-wrap justify-start p-1">
      <button
        onClick={() => onClick(undefined)}
        className={cn(`
        flex 
        items-center 
        text-center 
        font-medium
        text-primary/50
        hover:text-primary
        text-xs 
        md:text-sm 
        px-2 
        line-clamp-1
        md:px-4 
        py-2 
        md:py-2 
        rounded-full
        hover:opacity-75 
        transition
        `,
          !categoryId ? 'bg-primary/10  text-black' : 'bg-primary/5'
        )}
      >
        Newest
      </button>
      {categories_truncated && categories_truncated.map((item: Category) => (
        <button
          onClick={() => onClick(item.id)}
          className={cn(`
            flex 
            items-center 
            text-center 
            font-medium
            hover:text-primary
            text-xs 
            line-clamp-1
            md:text-sm 
            px-2 
            md:px-4 
            py-2 
            md:py-2 
            rounded-full 
            hover:opacity-75 
            transition
          `,
            item.id === categoryId ? 'bg-primary/25 text-black' : 'bg-primary/5'
          )}
          key={item.id}
        >
          {item.name}


          {/* <span className="ml-4">{item._count.companions}</span> */}
        </button>
      ))}
    </div>
  )
}