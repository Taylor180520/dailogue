import { MessageBubble } from "./message-bubble"
import type { MessageType } from "@/lib/types"
import type React from "react"

interface MessageListProps {
  messages: MessageType[]
  messageRefs: React.MutableRefObject<Record<string, React.RefObject<HTMLDivElement>>>
  onReply: (message: MessageType) => void
  onPin: (message: MessageType) => void
  onReaction: (messageId: string, reaction: string) => void
  onMarkImportant?: (message: MessageType) => void
  onPrivateMessage?: (user: MessageType["sender"], replyToMessage?: MessageType) => void
  onMuteUser?: (userId: string) => void
  onBanUser?: (userId: string) => void
}

export function MessageList({
  messages,
  messageRefs,
  onReply,
  onPin,
  onReaction,
  onMarkImportant,
  onPrivateMessage,
  onMuteUser,
  onBanUser,
}: MessageListProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${message.isSystem ? "flex justify-center" : ""}`}
          ref={messageRefs.current[message.id]}
        >
          {message.isSystem ? (
            <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md text-sm inline-block">{message.content}</div>
          ) : (
            <MessageBubble
              message={message}
              onReply={onReply}
              onPin={onPin}
              onReaction={onReaction}
              onMarkImportant={onMarkImportant}
              onPrivateMessage={onPrivateMessage}
              onMuteUser={onMuteUser}
              onBanUser={onBanUser}
            />
          )}
        </div>
      ))}
    </div>
  )
}
