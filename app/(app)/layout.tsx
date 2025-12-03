"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  UploadCloud,
  User,
  Film,
  X
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Explore" },
  { href: "/video-upload", icon: UploadCloud, label: "Upload" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-black overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/10
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-100 dark:border-white/5">
           <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-white tracking-tight">
              <Film className="w-5 h-5" />
              <span>GLIMPSE</span>
           </Link>
           <button 
             className="ml-auto lg:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
             onClick={() => setSidebarOpen(false)}
           >
             <X size={20} />
           </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
           <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 px-2">Menu</div>
           {sidebarItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link
                 key={item.href}
                 href={item.href}
                 onClick={() => setSidebarOpen(false)}
                 className={`
                   flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                   ${isActive 
                     ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md" 
                     : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                   }
                 `}
               >
                 <item.icon size={18} />
                 {item.label}
               </Link>
             );
           })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
          {user && (
            <div className="flex items-center gap-3 mb-4">
               <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 dark:border-white/10">
                 <img src={user.imageUrl} alt="User" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                   {user.fullName || user.username}
                 </p>
                 <p className="text-xs text-zinc-500 truncate">
                   {user.primaryEmailAddress?.emailAddress}
                 </p>
               </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOutIcon size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 flex items-center px-4 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <MenuIcon size={24} />
          </button>
          <span className="ml-3 font-semibold text-zinc-900 dark:text-white">GLIMPSE</span>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-black scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {children}
        </main>
      </div>
    </div>
  );
}