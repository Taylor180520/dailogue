"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Smile, Paperclip, X, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { MessageType } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MessageInputProps {
  onSendMessage: (content: string) => void
  replyTo: MessageType | null
  onCancelReply: () => void
}

export function MessageInput({ onSendMessage, replyTo, onCancelReply }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojis = ["😀", "😂", "🙂", "😍", "👍", "❤️", "🔥", "👏", "🎉", "🤔", "😢", "😎", "🙏", "👋", "🤝"]

  useEffect(() => {
    if (replyTo) {
      textareaRef.current?.focus()
    }
  }, [replyTo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    textareaRef.current?.focus()
  }

  return (
    <div className="border-t border-[#333] bg-[#121212] p-4">
      {replyTo && (
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Replying to</span>
            <span className="font-semibold">{replyTo.sender.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancelReply} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] max-h-[200px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
          />

          <div className="flex items-center justify-between px-3 py-2 border-t border-[#333]">
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-white">
                    <Smile className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="grid grid-cols-5 gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        className="text-xl hover:bg-gray-700 p-1 rounded"
                        onClick={() => addEmoji(emoji)}
                        type="button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-white">
                <Paperclip className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-white">
                <Mic className="h-5 w-5" />
              </Button>

              <Button type="submit" className="rounded-full px-4 h-8 bg-purple-600 hover:bg-purple-700">
                Send
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
