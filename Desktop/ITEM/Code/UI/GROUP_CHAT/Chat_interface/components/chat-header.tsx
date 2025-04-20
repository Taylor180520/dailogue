"use client"
import { Settings, Users, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatHeaderProps {
  agent: {
    name: string
    avatar: string
  }
  onlineCount: number
  onToggleMembers: () => void
  pinnedCount?: number
  importantCount?: number
  onOpenGlobalChat?: () => void
  onTogglePinnedMessages?: () => void
  onToggleImportantMessages?: () => void
  onOpenSettings?: () => void
}

export function ChatHeader({
  agent,
  onlineCount,
  onToggleMembers,
  pinnedCount = 0,
  importantCount = 0,
  onOpenGlobalChat,
  onTogglePinnedMessages,
  onToggleImportantMessages,
  onOpenSettings,
}: ChatHeaderProps) {
  return (
    <div className="h-16 border-b border-[#333] flex items-center justify-between px-6 bg-[#121212] sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
          <AvatarFallback>{agent.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-lg">{agent.name}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-gray-300 hover:text-white"
          title="Pinned messages"
          onClick={onTogglePinnedMessages}
        >
          <span className="text-lg">📌</span>
          {pinnedCount > 0 && <span className="text-xs">{pinnedCount}</span>}
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-1 text-gray-300 hover:text-white"
          title="Important messages"
          onClick={onToggleImportantMessages}
        >
          <span className="text-lg">⭐️</span>
          {importantCount > 0 && <span className="text-xs">{importantCount}</span>}
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-1 text-gray-300 hover:text-white"
          onClick={onOpenGlobalChat}
          title="Private messages"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
          onClick={onToggleMembers}
        >
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>{onlineCount} online</span>
          <Users className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={onOpenSettings}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
