// Simple toast notification system
type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    type: ToastType
    message: string
}

class ToastManager {
    private listeners: Array<(toasts: Toast[]) => void> = []
    private toasts: Toast[] = []

    subscribe(listener: (toasts: Toast[]) => void) {
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener)
        }
    }

    private notify() {
        this.listeners.forEach(listener => listener(this.toasts))
    }

    show(type: ToastType, message: string, duration = 3000) {
        const id = Math.random().toString(36).substr(2, 9)
        const toast: Toast = { id, type, message }

        this.toasts = [...this.toasts, toast]
        this.notify()

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id)
            }, duration)
        }

        return id
    }

    remove(id: string) {
        this.toasts = this.toasts.filter(t => t.id !== id)
        this.notify()
    }

    success(message: string, duration?: number) {
        return this.show('success', message, duration)
    }

    error(message: string, duration?: number) {
        return this.show('error', message, duration)
    }

    info(message: string, duration?: number) {
        return this.show('info', message, duration)
    }
}

export const toast = new ToastManager()
export type { Toast, ToastType }
