"use client"
import { usePixi } from "@/hooks/usePixi";
import Loading from "./loading";
import { Home, Plus, User, Navigation, Settings } from "lucide-react";

import { useState } from 'react';


const PixiWidget = () => {
  // loading widget should show for 5 secs
  const { data, isLoading } = usePixi();

  return ( 
    <>
    {/* {user?.id && 
            
              <div
                  className={cn("bg-[#232323] hidden lg:flex fixed h-48 w-48 rounded-xl bottom-2 right-2 z-[500] shadow-2xl justify-center",
                        `${styles.sidebar} ${isHovered ? styles.hovered : ''}`)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  >
                <button className="text-primary-foreground btn self-end border bg-transparent border-primary-foreground/5 mb-4">Generate Post</button>
              </div>
            } */}


    <div className="w-48 h-48 grow-0 flex-col justify-center bg-gradient-to-tr rounded-[14px] z-[600] bg-[#232323] shrink-0 active:scale-[.98] hover:scale-[1.02] hover:shadow-2xl cursor-pointer transition-shadow duration-200 flex items-center justify-center mt-auto fixed border-5 border-primary/20 top-auto right-10 bottom-10">
    
    {isLoading && <Loading color="white" />}
    {!isLoading && (
      <div className="items-center flex flex-col">
        <User  className="h-5 w-5 text-white" />
        <span className="block text-xs text-white font-medium">
          {/* (coin$) */}
          1,401</span>
      </div>
    ) }
    <button className="text-primary-foreground btn self-end border bg-transparent border-primary-foreground/5 mb-4">Generate Post</button>
    </div>


</>
  );
}
 
export default PixiWidget;