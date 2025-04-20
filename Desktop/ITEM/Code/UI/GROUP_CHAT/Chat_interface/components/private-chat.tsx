"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Smile, Paperclip, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import type { MessageType, UserType } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface PrivateChatProps {
  isOpen: boolean
  onClose: () => void
  user: UserType
  replyToMessage?: MessageType
  existingMessages?: MessageType[]
  onSendMessage?: (userId: string, content: string) => void
}

export function PrivateChat({
  isOpen,
  onClose,
  user,
  replyToMessage,
  existingMessages = [],
  onSendMessage,
}: PrivateChatProps) {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<MessageType[]>(existingMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setChatMessages(existingMessages)
  }, [existingMessages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [isOpen, chatMessages])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: MessageType = {
        id: `private-msg-${Date.now()}`,
        content: message,
        sender: {
          id: "current-user",
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          isOnline: true,
        },
        timestamp: new Date().toISOString(),
        reactions: [],
      }

      const updatedMessages = [...chatMessages, newMessage]
      setChatMessages(updatedMessages)

      if (onSendMessage) {
        onSendMessage(user.id, message)
      }

      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="h-full w-full bg-[#121212] border-l border-[#333] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            {user.role && <div className="text-xs text-gray-400">{user.role}</div>}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#1a1a1a]">
        {replyToMessage && (
          <div className="mb-6 bg-gray-800 p-3 rounded-lg border-l-2 border-purple-500">
            <div className="text-xs text-gray-400 mb-1">From Debt Collect Emma group chat:</div>
            <div className="flex items-start gap-2">
              <Avatar className="h-6 w-6 mt-1">
                <AvatarImage
                  src={replyToMessage.sender.avatar || "/placeholder.svg"}
                  alt={replyToMessage.sender.name}
                />
                <AvatarFallback>{replyToMessage.sender.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{replyToMessage.sender.name}</span>
                  <span className="text-xs text-gray-400">{formatTime(replyToMessage.timestamp)}</span>
                </div>
                <div className="text-sm mt-1">{replyToMessage.content}</div>
              </div>
            </div>
          </div>
        )}

        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Start a conversation with {user.name}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender.id === "current-user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender.id === "current-user" ? "bg-purple-500/30" : "bg-gray-700"
                  }`}
                >
                  {msg.content}
                  <div className="text-xs text-gray-300 mt-1 text-right">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#333]">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
            <Textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${user.name}...`}
              className="min-h-[60px] max-h-[120px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
            />
            <div className="flex items-center px-3 py-2 border-t border-[#333]">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-white">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-white">
                <Paperclip className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            className="h-10 w-10 rounded-full bg-purple-500/70 hover:bg-purple-600/80 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
