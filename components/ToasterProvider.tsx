"use client"

import { Toaster } from "react-hot-toast"

const ToasterProvider = () => {
    return (
        <Toaster 
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
                style: {
                    background: '#18181b', // zinc-950
                    color: '#fff',
                    border: '1px solid #27272a', // zinc-800
                    padding: '12px 16px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    maxWidth: '400px',
                },
                success: {
                    iconTheme: {
                        primary: '#4ade80', // green-400
                        secondary: '#18181b',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444', // red-500
                        secondary: '#fff',
                    },
                },
                className: 'font-sans text-sm font-medium shadow-xl'
            }}
        />
    )
}

export default ToasterProvider