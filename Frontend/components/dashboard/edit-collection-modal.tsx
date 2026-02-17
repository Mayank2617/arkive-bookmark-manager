"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FolderEdit, Check, Folder, Palette, Code, Brain, BookOpen, Briefcase } from "lucide-react"
import { updateCollection } from "@/lib/api/collections"
import { toast } from "@/lib/toast"

const iconOptions = [
    { id: "folder", icon: Folder },
    { id: "palette", icon: Palette },
    { id: "code", icon: Code },
    { id: "brain", icon: Brain },
    { id: "book", icon: BookOpen },
    { id: "briefcase", icon: Briefcase },
]

const colorOptions = [
    "hsl(280, 65%, 60%)", // Purple
    "hsl(160, 60%, 45%)", // Teal
    "hsl(220, 90%, 56%)", // Blue
    "hsl(340, 75%, 55%)", // Pink
    "hsl(30, 90%, 55%)",  // Orange
    "hsl(145, 65%, 45%)", // Green
    "hsl(0, 70%, 55%)",   // Red
    "hsl(50, 90%, 55%)",  // Yellow
]

interface Collection {
    id: string
    name: string
    icon: string
    color: string
}

interface EditCollectionModalProps {
    isOpen: boolean
    onClose: () => void
    collection: Collection | null
}

export function EditCollectionModal({
    isOpen,
    onClose,
    collection,
}: EditCollectionModalProps) {
    const [name, setName] = useState("")
    const [selectedIcon, setSelectedIcon] = useState("folder")
    const [selectedColor, setSelectedColor] = useState("hsl(0, 0%, 50%)")
    const [isSaving, setIsSaving] = useState(false)

    // Initialize form when collection changes
    useEffect(() => {
        if (collection) {
            setName(collection.name)
            setSelectedIcon(collection.icon)
            setSelectedColor(collection.color)
        }
    }, [collection])

    const handleSave = async () => {
        if (!collection || !name.trim()) return

        setIsSaving(true)
        try {
            await updateCollection(collection.id, {
                name: name.trim(),
                icon: selectedIcon,
                color: selectedColor,
            })
            console.log("✅ Collection updated successfully")
            onClose()
        } catch (error: any) {
            console.error("❌ Error updating collection:", error)
            toast.error(error.message || "Failed to update collection")
        } finally {
            setIsSaving(false)
        }
    }

    if (!collection) return null

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
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <FolderEdit className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-foreground">Edit Collection</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Name input */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        Collection Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter collection name"
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                                        autoFocus
                                    />
                                </div>

                                {/* Icon selection */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        Icon
                                    </label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {iconOptions.map(({ id, icon: Icon }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setSelectedIcon(id)}
                                                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${selectedIcon === id
                                                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                                                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color selection */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        Color
                                    </label>
                                    <div className="grid grid-cols-8 gap-2">
                                        {colorOptions.map((color: string) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={`h-8 w-8 rounded-lg border-2 transition-all ${selectedColor === color
                                                    ? "border-foreground ring-2 ring-primary/20 scale-110"
                                                    : "border-transparent hover:scale-105"
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                aria-label={`Select color ${color}`}
                                            >
                                                {selectedColor === color && (
                                                    <Check className="h-4 w-4 mx-auto text-white drop-shadow" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                                <button
                                    onClick={onClose}
                                    disabled={isSaving}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !name.trim()}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
