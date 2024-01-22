// menuItems.ts

import { Home, Plus, Bot, UsersRound, Bell, Navigation, Settings } from "lucide-react"; // Adjust the import path to your icon components

export const menu_items = [
  {
    icon: Home,
    href: '/home',
    label: "Home",
    pro: false,
  },
  {
    icon: UsersRound,
    href: '/browse',
    label: "Browse",
    pro: false,
    alert: false,
    notification: "",
  },
  {
    icon: Bot,
    href: '/pixi',
    label: "Pixi",
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
  // {
  //   icon: Plus,
  //   href: '/companion/new',
  //   label: "Create",
  //   pro: false,
  // },
  {
    icon: Settings,
    href: '/settings',
    label: "Settings",
    pro: false,
  },
];
