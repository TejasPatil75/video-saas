import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-zinc-900 dark:text-white">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
               <span className="text-white dark:text-black text-xs">G</span>
            </div>
            GLIMPSE
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 px-6 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">v2.0 is now live</span>
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Video hosting, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-zinc-500 dark:to-white">
            reimagined for creators.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
          Upload, manage, and analyze your video content with AI-powered insights. 
          The cleanest experience for modern development teams.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <Link 
            href="/home" 
            className="h-12 px-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-medium flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            Start Uploading <ArrowRight size={18} />
          </Link>
          <button className="h-12 px-8 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white font-medium flex items-center justify-center gap-2 transition-colors">
            <PlayCircle size={18} /> Watch Demo
          </button>
        </div>

        {/* Dashboard Mockup (Visual Interest) */}
<div className="mt-20 relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-1000 delay-300">
    <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
        <img 
          src="/dashboard.png" 
          alt="Dashboard Preview"
          className="w-full h-full object-cover object-left"
        />
    </div>
</div>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 dark:text-zinc-500 text-sm">
          © {new Date().getFullYear()} GLIMPSE Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}