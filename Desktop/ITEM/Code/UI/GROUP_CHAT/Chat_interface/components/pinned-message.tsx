"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MessageType } from "@/lib/types"

interface PinnedMessageProps {
  message: MessageType
  onClose: () => void
}

export function PinnedMessage({ message, onClose }: PinnedMessageProps) {
  return (
    <div className="bg-gray-800 border-b border-[#333] p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-gray-400">📌</div>
        <div className="text-sm">
          <span className="font-semibold">{message.sender.name}: </span>
          {message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content}
        </div>
      </div>

      <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
