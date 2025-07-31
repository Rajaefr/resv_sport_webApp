// src/components/ui/Modal.tsx
"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export function Modal({ open, onOpenChange, title, children }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  title: string,
  children: React.ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Dialog.Close asChild>
              <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
