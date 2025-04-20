"use client"

import type React from "react"

import { useState, useRef, useEffect, createRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatHeader } from "@/components/chat-header"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"
import { MemberPanel } from "@/components/member-panel"
import { PinnedMessage } from "@/components/pinned-message"
import { TypingIndicator } from "@/components/typing-indicator"
import { PrivateChat } from "@/components/private-chat"
import { PinnedMessagesPanel } from "@/components/pinned-messages-panel"
import { ImportantMessagesPanel } from "@/components/important-messages-panel"
import { ResizablePanel } from "@/components/resizable-panel"
import { ChatSettings } from "@/components/chat-settings"
import type { MessageType, UserType } from "@/lib/types"
import { initialMessages, initialUsers } from "@/lib/mock-data"
import { toast } from "@/components/ui/use-toast"

type ActivePanel = "none" | "members" | "pinned" | "important" | "privateChat" | "globalChat" | "settings"

export default function GroupChatPage() {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const [users, setUsers] = useState<UserType[]>(initialUsers.filter((user) => user.id !== "current-user"))
  const [activePanel, setActivePanel] = useState<ActivePanel>("none")
  const [pinnedMessage, setPinnedMessage] = useState<MessageType | null>(null)
  const [replyTo, setReplyTo] = useState<MessageType | null>(null)
  const [isTyping, setIsTyping] = useState(true)
  const [pinnedCount, setPinnedCount] = useState(0)
  const [importantCount, setImportantCount] = useState(0)
  const [privateChatUser, setPrivateChatUser] = useState<UserType | null>(null)
  const [privateChatReplyMessage, setPrivateChatReplyMessage] = useState<MessageType | null>(null)
  const [privateMessages, setPrivateMessages] = useState<Record<string, MessageType[]>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [transitionMessage, setTransitionMessage] = useState(true)
  const [panelWidth, setPanelWidth] = useState(380) // Increased default panel width
  const [showSettings, setShowSettings] = useState(false)
  const [mutedUsers, setMutedUsers] = useState<string[]>([])
  const [bannedUsers, setBannedUsers] = useState<string[]>([])

  // Add this after all state variables are initialized
  const filteredUsers = users.filter((user) => !bannedUsers.includes(user.id))

  // Create refs for each message for scrolling
  const messageRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({})

  // Initialize refs for existing messages
  useEffect(() => {
    messages.forEach((message) => {
      if (!messageRefs.current[message.id]) {
        messageRefs.current[message.id] = createRef<HTMLDivElement>()
      }
    })
  }, [messages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Show transition message briefly
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitionMessage(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Simulate typing indicator
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setIsTyping((prev) => !prev)
    }, 8000)
    return () => clearInterval(typingInterval)
  }, [])

  const handlePanelWidthChange = (width: number) => {
    setPanelWidth(width)
  }

  const handleSendMessage = (content: string) => {
    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      content,
      sender: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
      },
      timestamp: new Date().toISOString(),
      replyTo: replyTo,
      reactions: [],
    }

    setMessages([...messages, newMessage])
    setReplyTo(null)
  }

  const handleSendPrivateMessage = (userId: string, content: string) => {
    const newMessage: MessageType = {
      id: `private-msg-${Date.now()}`,
      content,
      sender: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
      },
      timestamp: new Date().toISOString(),
      reactions: [],
    }

    // Add a simulated response from the other user
    const responseMessage: MessageType = {
      id: `private-msg-${Date.now() + 1}`,
      content: `Thanks for your message. This is an automated response from ${users.find((u) => u.id === userId)?.name}.`,
      sender: users.find((u) => u.id === userId) || {
        id: userId,
        name: "User",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
      },
      timestamp: new Date(Date.now() + 2000).toISOString(),
      reactions: [],
    }

    setPrivateMessages((prev) => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMessage, responseMessage],
    }))
  }

  const handlePinMessage = (message: MessageType) => {
    setPinnedMessage(message)
    setPinnedCount((prevCount) => prevCount + 1)
    setMessages(messages.map((m) => (m.id === message.id ? { ...m, isPinned: true } : m)))

    toast({
      title: "Message pinned",
      description: "Message has been pinned to the chat",
    })
  }

  const handleMarkImportant = (message: MessageType) => {
    setImportantCount((prevCount) => prevCount + 1)
    setMessages(messages.map((m) => (m.id === message.id ? { ...m, isImportant: true } : m)))

    toast({
      title: "Marked as important",
      description: "Message has been marked as important",
    })
  }

  const handleReaction = (messageId: string, reaction: string) => {
    const currentUser = {
      id: "current-user",
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    }

    setMessages(
      messages.map((m) => {
        if (m.id === messageId) {
          const existingReaction = m.reactions.find((r) => r.type === reaction)
          if (existingReaction) {
            // Check if user already reacted
            const userAlreadyReacted = existingReaction.users?.some((u) => u.id === currentUser.id)

            if (userAlreadyReacted) {
              return m // Don't add duplicate reaction
            }

            return {
              ...m,
              reactions: m.reactions.map((r) =>
                r.type === reaction
                  ? {
                      ...r,
                      count: r.count + 1,
                      users: [...(r.users || []), currentUser],
                    }
                  : r,
              ),
            }
          } else {
            return {
              ...m,
              reactions: [
                ...m.reactions,
                {
                  type: reaction,
                  count: 1,
                  users: [currentUser],
                },
              ],
            }
          }
        }
        return m
      }),
    )
  }

  const handlePrivateMessage = (user: UserType, replyToMessage?: MessageType) => {
    setPrivateChatUser(user)
    setPrivateChatReplyMessage(replyToMessage || null)
    setActivePanel("privateChat")
    setShowSettings(false)
  }

  const closePrivateChat = () => {
    setPrivateChatUser(null)
    setPrivateChatReplyMessage(null)
    setActivePanel("none")
  }

  const handleOpenGlobalChat = () => {
    setActivePanel("globalChat")
    setPrivateChatUser(null)
    setPrivateChatReplyMessage(null)
    setShowSettings(false)
  }

  const handleTogglePinnedMessages = () => {
    setActivePanel(activePanel === "pinned" ? "none" : "pinned")
    setShowSettings(false)
  }

  const handleToggleImportantMessages = () => {
    setActivePanel(activePanel === "important" ? "none" : "important")
    setShowSettings(false)
  }

  const handleToggleMembers = () => {
    setActivePanel(activePanel === "members" ? "none" : "members")
    setShowSettings(false)
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
    setActivePanel("settings")
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
    setActivePanel("none")
  }

  const handleViewMessage = (message: MessageType) => {
    // Scroll to the message
    if (messageRefs.current[message.id]?.current) {
      messageRefs.current[message.id].current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })

      // Highlight the message temporarily
      const element = messageRefs.current[message.id].current
      if (element) {
        element.classList.add("bg-purple-500/20", "transition-colors", "duration-1000")
        setTimeout(() => {
          element.classList.remove("bg-purple-500/20")
        }, 2000)
      }
    }

    setActivePanel("none")

    toast({
      title: "Viewing message",
      description: "Scrolling to selected message",
    })
  }

  const handleMuteUser = (userId: string) => {
    if (!mutedUsers.includes(userId)) {
      setMutedUsers([...mutedUsers, userId])
      toast({
        title: "User muted",
        description: "User has been muted in this chat",
      })
    }
  }

  const handleUnmuteUser = (userId: string) => {
    setMutedUsers(mutedUsers.filter((id) => id !== userId))
    toast({
      title: "User unmuted",
      description: "User has been unmuted in this chat",
    })
  }

  const handleSetAdmin = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: "Admin" } : user)))

    toast({
      title: "Admin status updated",
      description: `User is now an admin`,
    })
  }

  const handleRevokeAdmin = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: "Member" } : user)))

    toast({
      title: "Admin status updated",
      description: `User is no longer an admin`,
    })
  }

  const handleBanUser = (userId: string) => {
    if (!bannedUsers.includes(userId)) {
      setBannedUsers([...bannedUsers, userId])
      toast({
        title: "User banned",
        description: "User has been removed from the chat",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col relative ml-60">
        {transitionMessage && (
          <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white py-2 px-4 text-center z-10 transition-all">
            你正在与 Agent 用户群 进行交流
          </div>
        )}

        <ChatHeader
          agent={{
            name: "Debt Collect Emma",
            avatar: "/placeholder.svg?height=40&width=40",
          }}
          onlineCount={users.filter((u) => u.isOnline).length}
          onToggleMembers={handleToggleMembers}
          pinnedCount={pinnedCount}
          importantCount={importantCount}
          onOpenGlobalChat={handleOpenGlobalChat}
          onTogglePinnedMessages={handleTogglePinnedMessages}
          onToggleImportantMessages={handleToggleImportantMessages}
          onOpenSettings={handleOpenSettings}
        />

        {pinnedMessage && <PinnedMessage message={pinnedMessage} onClose={() => setPinnedMessage(null)} />}

        <div className="flex-1 flex overflow-hidden relative">
          <div className={`flex-1 overflow-y-auto bg-[#1a1a1a] p-4 pt-6 ${activePanel !== "none" ? "mr-[380px]" : ""}`}>
            <MessageList
              messages={messages}
              messageRefs={messageRefs}
              onReply={setReplyTo}
              onPin={handlePinMessage}
              onReaction={handleReaction}
              onMarkImportant={handleMarkImportant}
              onPrivateMessage={handlePrivateMessage}
              onMuteUser={handleMuteUser}
              onBanUser={handleBanUser}
            />
            <div ref={messagesEndRef} />
          </div>

          {activePanel === "members" && (
            <div className="absolute right-0 top-0 bottom-0 z-30">
              <ResizablePanel defaultWidth={panelWidth} onWidthChange={handlePanelWidthChange} minWidth={320}>
                <MemberPanel
                  users={filteredUsers}
                  mutedUsers={mutedUsers}
                  onClose={() => setActivePanel("none")}
                  onPrivateMessage={handlePrivateMessage}
                  onMuteUser={handleMuteUser}
                  onUnmuteUser={handleUnmuteUser}
                  onBanUser={handleBanUser}
                  onSetAdmin={handleSetAdmin}
                  onRevokeAdmin={handleRevokeAdmin}
                />
              </ResizablePanel>
            </div>
          )}

          {activePanel === "pinned" && (
            <div className="absolute right-0 top-0 bottom-0 z-30">
              <ResizablePanel defaultWidth={panelWidth} onWidthChange={handlePanelWidthChange} minWidth={320}>
                <PinnedMessagesPanel
                  isOpen={true}
                  onClose={() => setActivePanel("none")}
                  messages={messages}
                  onViewMessage={handleViewMessage}
                />
              </ResizablePanel>
            </div>
          )}

          {activePanel === "important" && (
            <div className="absolute right-0 top-0 bottom-0 z-30">
              <ResizablePanel defaultWidth={panelWidth} onWidthChange={handlePanelWidthChange} minWidth={320}>
                <ImportantMessagesPanel
                  isOpen={true}
                  onClose={() => setActivePanel("none")}
                  messages={messages}
                  onViewMessage={handleViewMessage}
                />
              </ResizablePanel>
            </div>
          )}

          {(activePanel === "privateChat" || activePanel === "globalChat") && (
            <div className="absolute right-0 top-0 bottom-0 z-30">
              <ResizablePanel defaultWidth={panelWidth} onWidthChange={handlePanelWidthChange} minWidth={320}>
                <PrivateChat
                  isOpen={true}
                  onClose={closePrivateChat}
                  user={
                    privateChatUser || {
                      id: "global-chat",
                      name: "Private Messages",
                      avatar: "/placeholder.svg?height=40&width=40",
                      isOnline: true,
                    }
                  }
                  replyToMessage={privateChatReplyMessage || undefined}
                  existingMessages={
                    privateChatUser ? privateMessages[privateChatUser.id] || [] : privateMessages["global-chat"] || []
                  }
                  onSendMessage={handleSendPrivateMessage}
                />
              </ResizablePanel>
            </div>
          )}

          {activePanel === "settings" && (
            <div className="absolute right-0 top-0 bottom-0 z-30">
              <ResizablePanel defaultWidth={panelWidth} onWidthChange={handlePanelWidthChange} minWidth={320}>
                <div className="h-full w-full">
                  <ChatSettings isOpen={true} onClose={handleCloseSettings} />
                </div>
              </ResizablePanel>
            </div>
          )}
        </div>

        {isTyping && (
          <TypingIndicator
            user={{
              name: "Emma Developer",
              avatar: "/placeholder.svg?height=40&width=40",
            }}
          />
        )}

        <MessageInput onSendMessage={handleSendMessage} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
      </main>
    </div>
  )
}
