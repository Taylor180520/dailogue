"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { MessageType } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface PinnedMessagesPanelProps {
  isOpen: boolean
  onClose: () => void
  messages: MessageType[]
  onViewMessage?: (message: MessageType) => void
}

export function PinnedMessagesPanel({ isOpen, onClose, messages, onViewMessage }: PinnedMessagesPanelProps) {
  const pinnedMessages = messages.filter((m) => m.isPinned)

  if (!isOpen) return null

  return (
    <div className="h-full w-full bg-[#121212] border-l border-[#333] flex flex-col">
      <div className="flex items-center justify-between border-b border-[#333] p-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">📌</span>
          <h2 className="text-lg font-semibold">Pinned Messages</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {pinnedMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No pinned messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pinnedMessages.map((message) => (
              <div
                key={message.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onViewMessage && onViewMessage(message)}
              >
                <div className="flex items-start gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{message.sender.name}</span>
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="pl-11">{message.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
