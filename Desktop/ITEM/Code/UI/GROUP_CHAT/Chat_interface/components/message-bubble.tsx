"use client"

import type React from "react"

import { useState } from "react"
import { Reply, Pin, Smile, MoreHorizontal, Copy, MessageSquare, Star, VolumeX, UserX } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { MessageType, ReactionType, UserType } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { ReactionUsersDialog } from "@/components/reaction-users-dialog"
import { MuteUserDialog } from "@/components/mute-user-dialog"
import { BanUserDialog } from "@/components/ban-user-dialog"

interface MessageBubbleProps {
  message: MessageType
  onReply: (message: MessageType) => void
  onPin: (message: MessageType) => void
  onReaction: (messageId: string, reaction: string) => void
  onMarkImportant?: (message: MessageType) => void
  onPrivateMessage?: (user: MessageType["sender"], replyToMessage?: MessageType) => void
  onMuteUser?: (userId: string) => void
  onBanUser?: (userId: string) => void
}

export function MessageBubble({
  message,
  onReply,
  onPin,
  onReaction,
  onMarkImportant,
  onPrivateMessage,
  onMuteUser,
  onBanUser,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const isCurrentUser = message.sender.id === "current-user"

  const reactions = ["👍", "👎", "😂", "🔥", "❤️"]

  const [showReactionUsers, setShowReactionUsers] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState<{ type: string; users: UserType[] } | null>(null)
  const [showMuteDialog, setShowMuteDialog] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)

  const handleCopyMessage = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(message.content)
    toast({
      title: "Message copied",
      description: "Message content copied to clipboard",
    })
  }

  const handleMarkImportant = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMarkImportant) {
      onMarkImportant(message)
    }
  }

  const handlePrivateMessage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPrivateMessage) {
      onPrivateMessage(message.sender, message)
    }
  }

  const handlePinMessage = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPin(message)
  }

  const handleShowReactionUsers = (reaction: ReactionType) => {
    setSelectedReaction({
      type: reaction.type,
      users: reaction.users || [],
    })
    setShowReactionUsers(true)
  }

  const handleMuteUser = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMuteDialog(true)
  }

  const handleMuteConfirm = () => {
    if (onMuteUser) {
      onMuteUser(message.sender.id)
    }
    setShowMuteDialog(false)
  }

  const handleBanUser = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowBanDialog(true)
  }

  const handleBanConfirm = () => {
    if (onBanUser) {
      onBanUser(message.sender.id)
    }
    setShowBanDialog(false)
  }

  return (
    <>
      <div
        className={`group flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => {
          if (!dropdownOpen) {
            setShowActions(false)
          }
        }}
      >
        <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
          <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
        </Avatar>

        <div className={`max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}>
          <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
            <span className="font-semibold">{message.sender.name}</span>
            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
          </div>

          {message.replyTo && (
            <div className="bg-gray-800 rounded p-2 mb-2 text-sm text-gray-300 border-l-2 border-purple-500">
              <span className="font-semibold">{message.replyTo.sender.name}: </span>
              {message.replyTo.content.length > 50
                ? `${message.replyTo.content.substring(0, 50)}...`
                : message.replyTo.content}
            </div>
          )}

          <div className="relative flex items-center">
            <div className={`p-3 rounded-lg ${isCurrentUser ? "bg-purple-500/30" : "bg-gray-700"}`}>
              {message.content.includes("<button>Test Run</button>") ? (
                <div>
                  {message.content.split("<button>Test Run</button>")[0]}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mx-1 bg-purple-600 hover:bg-purple-700 border-none text-white"
                  >
                    Test Run
                  </Button>
                  {message.content.split("<button>Test Run</button>")[1]}
                </div>
              ) : (
                message.content
              )}
            </div>

            {/* Action buttons - positioned to the right of the message content (same row) */}
            {(showActions || dropdownOpen) && (
              <div className="ml-2 bg-gray-800 rounded-full flex items-center shadow-lg z-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onReply(message)}>
                  <Reply className="h-4 w-4" />
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="flex gap-2">
                      {reactions.map((reaction) => (
                        <button
                          key={reaction}
                          className="text-xl hover:bg-gray-700 p-1 rounded"
                          onClick={() => onReaction(message.id, reaction)}
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-800 border-gray-700 text-white"
                    onClick={(e) => e.stopPropagation()}
                    forceMount
                  >
                    <DropdownMenuItem
                      onClick={handleCopyMessage}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handlePrivateMessage}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Message privately</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleMarkImportant}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    >
                      <Star className="h-4 w-4" />
                      <span>Mark as important</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handlePinMessage}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    >
                      <Pin className="h-4 w-4" />
                      <span>Pin</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleMuteUser}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                    >
                      <VolumeX className="h-4 w-4" />
                      <span>Mute this user</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleBanUser}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 text-red-500"
                    >
                      <UserX className="h-4 w-4" />
                      <span>Ban this user</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {message.reactions.map((reaction, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleShowReactionUsers(reaction)}
                >
                  <span>{reaction.type}</span>
                  <span className="text-gray-400">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showReactionUsers && selectedReaction && (
        <ReactionUsersDialog
          isOpen={showReactionUsers}
          onClose={() => setShowReactionUsers(false)}
          emoji={selectedReaction.type}
          users={selectedReaction.users}
        />
      )}

      {showMuteDialog && (
        <MuteUserDialog
          isOpen={showMuteDialog}
          onClose={() => setShowMuteDialog(false)}
          user={message.sender}
          onConfirm={handleMuteConfirm}
        />
      )}

      {showBanDialog && (
        <BanUserDialog
          isOpen={showBanDialog}
          onClose={() => setShowBanDialog(false)}
          user={message.sender}
          onConfirm={handleBanConfirm}
        />
      )}
    </>
  )
}
