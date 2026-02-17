"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"
import { toast, Toast } from "@/lib/toast"

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([])

    useEffect(() => {
        const unsubscribe = toast.subscribe(setToasts)
        return unsubscribe
    }, [])

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm min-w-[300px] max-w-md ${t.type === "success"
                                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                : t.type === "error"
                                    ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                                    : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                            }`}
                    >
                        {t.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                        {t.type === "error" && <XCircle className="h-5 w-5 shrink-0" />}
                        {t.type === "info" && <Info className="h-5 w-5 shrink-0" />}

                        <p className="flex-1 text-sm font-medium">{t.message}</p>

                        <button
                            onClick={() => toast.remove(t.id)}
                            className="shrink-0 rounded-md p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                            aria-label="Dismiss"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
