"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Home,
  CreditCard,
  Ship,
  Mail,
  Linkedin,
  Zap,
  BarChart3,
  Settings,
  User,
  Star,
  Heart,
  Bookmark,
  Calendar,
} from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
      },
      {
        title: "Leads",
        href: "/leads",
        icon: CreditCard,
      },
      {
        title: "Campaign",
        href: "/campaigns",
        icon: Ship,
      },
      {
        title: "Messages",
        href: "/messages",
        icon: Mail,
        badge: "99",
      },
      {
        title: "LinkedIn Accounts",
        href: "/linkedin-accounts",
        icon: Linkedin,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Setting & Billing",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
  {
    title: "Admin Panel",
    items: [
      {
        title: "Activity logs",
        href: "/activity-logs",
        icon: Zap,
      },
      {
        title: "User logs",
        href: "/user-logs",
        icon: BarChart3,
      },
    ],
  },
];

export function Sidebar() {
  const { isCollapsed, toggleCollapse, setCollapsed } = useSidebarStore();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Only handle mobile responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      // Only auto-collapse when on mobile and sidebar is expanded
      if (isMobile && !isCollapsed) {
        setCollapsed(true);
      }
    };

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isCollapsed, setCollapsed]);

  const toggleSidebar = () => {
    toggleCollapse();
  };

  const handleNavItemClick = () => {
    // On mobile, collapse sidebar when a nav item is clicked
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
        "fixed md:relative z-50 md:z-auto h-screen md:h-full max-h-screen",
        "overflow-hidden", // Prevent content overflow
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <Image 
                src="/images/logos/linkbird-logo.jpg" 
                alt="LinkBird Logo"
                width={32}
                height={32}
                className="flex-shrink-0"
              />
              <h1 className="text-xl font-bold">
                <span className="text-black">Link</span>
                <span className="text-blue-600">Bird</span>
              </h1>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Image 
                src="/images/logos/linkbird-logo.jpg" 
                alt="LinkBird Logo"
                width={28}
                height={28}
                className="flex-shrink-0"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6 p-1"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left",
            isCollapsed && "justify-center px-2"
          )}
        >
          <User className="h-5 w-5 flex-shrink-0 text-black" />
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium text-gray-700">
              Kandid Personal
            </span>
          )}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto min-h-0 hide-scrollbar">
        {navigationItems.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href} onClick={handleNavItemClick}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isCollapsed && "justify-center px-2",
                        isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0 text-black" />
                      {!isCollapsed && (
                        <>
                          <span className="ml-3 text-sm font-medium">{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
        )}
        <div className={cn(
          "grid gap-2",
          isCollapsed ? "grid-cols-1" : "grid-cols-4"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-gray-100"
            title="Favorites"
          >
            <Star className="h-4 w-4 text-black" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-gray-100"
            title="Saved Items"
          >
            <Bookmark className="h-4 w-4 text-black" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-gray-100"
            title="Calendar"
          >
            <Calendar className="h-4 w-4 text-black" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-gray-100"
            title="Liked"
          >
            <Heart className="h-4 w-4 text-black" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
              <Avatar className="h-10 w-10">
                <AvatarImage src={session?.user?.image || "/images/avatars/person.jpg"} alt={session?.user?.name || ""} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {session?.user?.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">{session?.user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
