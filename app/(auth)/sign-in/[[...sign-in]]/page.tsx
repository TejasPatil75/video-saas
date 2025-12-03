import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black relative overflow-hidden">
      
      {/* Background Decor: Subtle Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Background Decor: Radial Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to access your video dashboard</p>
        </div>
        
        <div className="flex justify-center">
            <SignIn 
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full",
                        headerTitle: "hidden", // We used our own header above
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-200",
                        formButtonPrimary: "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 !shadow-none",
                        footerActionLink: "text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white underline decoration-zinc-300 underline-offset-4",
                        formFieldInput: "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white",
                        formFieldLabel: "text-zinc-600 dark:text-zinc-400"
                    }
                }}
            />
        </div>
      </div>
    </div>
  )
}