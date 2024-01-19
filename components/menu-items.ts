// menuItems.ts

import { Home, Plus, User, Bell, Navigation, Settings } from "lucide-react"; // Adjust the import path to your icon components

export const menu_items = [
  {
    icon: Home,
    href: '/home',
    label: "Home",
    pro: false,
  },
    {
      icon: User,
      href: '/browse',
      label: "Browse",
      pro: false,
      alert: false,
      notification: "",
    },
  // {
  //   icon: Bell,
  //   href: '/explore',
  //   label: "Explore",
  //   pro: false,
  // },
  {
    icon: Plus,
    href: '/companion/new',
    label: "Create",
    pro: false,
  },
  {
    icon: Settings,
    href: '/settings',
    label: "Settings",
    pro: false,
  },
];
