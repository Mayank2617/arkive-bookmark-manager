"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Folder, Palette, Code, Brain, BookOpen, Briefcase, Plus } from "lucide-react"
import { createCollection } from "@/lib/api/collections"
import { toast } from "@/lib/toast"

interface AddCollectionModalProps {
    isOpen: boolean
    onClose: () => void
}

const iconOptions = [
    { value: "folder", icon: Folder, label: "Folder" },
    { value: "palette", icon: Palette, label: "Palette" },
    { value: "code", icon: Code, label: "Code" },
    { value: "brain", icon: Brain, label: "Brain" },
    { value: "book", icon: BookOpen, label: "Book" },
    { value: "briefcase", icon: Briefcase, label: "Briefcase" },
]

const colorOptions = [
    { value: "hsl(280, 65%, 60%)", label: "Purple" },
    { value: "hsl(160, 60%, 45%)", label: "Teal" },
    { value: "hsl(220, 90%, 56%)", label: "Blue" },
    { value: "hsl(340, 75%, 55%)", label: "Pink" },
    { value: "hsl(30, 90%, 55%)", label: "Orange" },
    { value: "hsl(145, 65%, 45%)", label: "Green" },
]

export function AddCollectionModal({ isOpen, onClose }: AddCollectionModalProps) {
    const [name, setName] = useState("")
    const [selectedIcon, setSelectedIcon] = useState("folder")
    const [selectedColor, setSelectedColor] = useState("hsl(280, 65%, 60%)")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error("Please enter a collection name")
            return
        }

        setIsLoading(true)
        try {
            await createCollection({
                name: name.trim(),
                icon: selectedIcon,
                color: selectedColor,
            })

            console.log("✅ Collection created successfully")

            // Reset form
            setName("")
            setSelectedIcon("folder")
            setSelectedColor("hsl(280, 65%, 60%)")
            onClose()
        } catch (error: any) {
            console.error("❌ Error creating collection:", error)
            toast.error(error.message || "Failed to create collection")
        } finally {
            setIsLoading(false)
        }
    }

    const reset = () => {
        setName("")
        setSelectedIcon("folder")
        setSelectedColor("hsl(280, 65%, 60%)")
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                <h2 className="text-lg font-semibold text-foreground">New Collection</h2>
                                <button
                                    onClick={() => {
                                        reset()
                                        onClose()
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6">
                                {/* Collection Name */}
                                <div className="mb-6">
                                    <label htmlFor="collection-name" className="mb-2 block text-sm font-medium text-foreground">
                                        Collection Name
                                    </label>
                                    <input
                                        id="collection-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Design Inspiration"
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        autoFocus
                                    />
                                </div>

                                {/* Icon Selection */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Icon</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {iconOptions.map((option) => {
                                            const Icon = option.icon
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setSelectedIcon(option.value)}
                                                    className={`flex h-12 items-center justify-center rounded-lg border-2 transition-all ${selectedIcon === option.value
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border bg-background hover:border-primary/50"
                                                        }`}
                                                    title={option.label}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Color</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {colorOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setSelectedColor(option.value)}
                                                className={`flex h-12 items-center justify-center rounded-lg border-2 transition-all ${selectedColor === option.value
                                                    ? "border-primary scale-110"
                                                    : "border-transparent hover:scale-105"
                                                    }`}
                                                style={{ backgroundColor: option.value }}
                                                title={option.label}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset()
                                            onClose()
                                        }}
                                        className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !name.trim()}
                                        className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Creating..." : "Create Collection"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
