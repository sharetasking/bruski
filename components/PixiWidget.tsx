"use client"
import { usePixi } from "@/hooks/usePixi";
import Loading from "./loading";
import { Home, Plus, User, Navigation, Settings } from "lucide-react";

const PixiWidget = () => {
  // loading widget should show for 5 secs
  const { data, isLoading } = usePixi();

  return ( 
    <div className="w-24 h-16 grow-0 bg-gradient-to-tr rounded-[140px] z-[600] from-primary/70 via-primary/70 to-primary/60 shrink-0 active:scale-[.98] hover:scale-[1.02] hover:shadow-2xl cursor-pointer transition-shadow duration-200 flex items-center justify-center mt-auto fixed border-5 border-primary/20 top-auto right-10 bottom-10">
    
    {isLoading && <Loading color="white" />}
    {!isLoading && (
      <div className="items-center flex flex-col">
        <User  className="h-5 w-5 text-white" />
        <span className="block text-xs text-white font-medium">
          {/* (coin$) */}
          1,401</span>
      </div>
    ) }
    







    </div>
  );
}
 
export default PixiWidget;