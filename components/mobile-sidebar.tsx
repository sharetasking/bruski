import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = ({
  isPro
}: {
  isPro: boolean;
}) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2" aria-label="Mobile Menu Toggle">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-primary-foreground pt-10 w-32 shadow-none">
        <Sidebar isPro={isPro} />
      </SheetContent>
    </Sheet>
  );
};
