"use client"

import { useState } from "react"
import { X, ExternalLink, MessageSquare, Search, MoreVertical, UserCheck, VolumeX, Volume2, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import type { UserType } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MuteUserDialog } from "@/components/mute-user-dialog"
import { BanUserDialog } from "@/components/ban-user-dialog"

interface MemberPanelProps {
  users: UserType[]
  mutedUsers: string[]
  onClose: () => void
  onPrivateMessage?: (user: UserType) => void
  onMuteUser?: (userId: string) => void
  onUnmuteUser?: (userId: string) => void
  onBanUser?: (userId: string) => void
  onSetAdmin?: (userId: string) => void
  onRevokeAdmin?: (userId: string) => void
}

export function MemberPanel({
  users,
  mutedUsers,
  onClose,
  onPrivateMessage,
  onMuteUser,
  onUnmuteUser,
  onBanUser,
  onSetAdmin,
  onRevokeAdmin,
}: MemberPanelProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMuteDialog, setShowMuteDialog] = useState<UserType | null>(null)
  const [showBanDialog, setShowBanDialog] = useState<UserType | null>(null)

  const handleTalkToMe = (user: UserType) => {
    if (onPrivateMessage) {
      onPrivateMessage(user)
    }
    setSelectedUser(null)
  }

  const handleSetAdmin = (user: UserType) => {
    if (onSetAdmin) {
      onSetAdmin(user.id)
    }
  }

  const handleRevokeAdmin = (user: UserType) => {
    if (onRevokeAdmin) {
      onRevokeAdmin(user.id)
    }
  }

  const handleMuteUser = (user: UserType) => {
    setShowMuteDialog(user)
  }

  const handleUnmuteUser = (user: UserType) => {
    if (onUnmuteUser) {
      onUnmuteUser(user.id)
    }
  }

  const handleBanUser = (user: UserType) => {
    setShowBanDialog(user)
  }

  const handleMuteConfirm = (duration: string, timeUnit: string) => {
    if (showMuteDialog && onMuteUser) {
      onMuteUser(showMuteDialog.id)
      setShowMuteDialog(null)
    }
  }

  const handleBanConfirm = () => {
    if (showBanDialog && onBanUser) {
      onBanUser(showBanDialog.id)
      setShowBanDialog(null)
    }
  }

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="w-full h-full border-l border-[#333] bg-[#121212] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <h3 className="font-semibold">Members ({users.length})</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3 border-b border-[#333]">
        <div className="relative">
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#1a1a1a] border-[#333] text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-sm">No members found</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer group"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400">
                    {user.role || "Member"}
                    {mutedUsers.includes(user.id) && <span className="ml-2 text-red-400">(Muted)</span>}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gray-800 border-gray-700 text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.role !== "Agent Owner" &&
                    (user.role === "Admin" ? (
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                        onClick={() => handleRevokeAdmin(user)}
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Revoke admin</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                        onClick={() => handleSetAdmin(user)}
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Set as admin</span>
                      </DropdownMenuItem>
                    ))}

                  {mutedUsers.includes(user.id) ? (
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                      onClick={() => handleUnmuteUser(user)}
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Unmute this user</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                      onClick={() => handleMuteUser(user)}
                    >
                      <VolumeX className="h-4 w-4" />
                      <span>Mute this user</span>
                    </DropdownMenuItem>
                  )}

                  {user.role !== "Agent Owner" && (
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 text-red-500"
                      onClick={() => handleBanUser(user)}
                    >
                      <UserX className="h-4 w-4" />
                      <span>Ban this user</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>

      {selectedUser && (
        <UserProfileDialog
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onTalkToMe={() => handleTalkToMe(selectedUser)}
        />
      )}

      {showMuteDialog && (
        <MuteUserDialog
          isOpen={true}
          onClose={() => setShowMuteDialog(null)}
          user={showMuteDialog}
          onConfirm={handleMuteConfirm}
        />
      )}

      {showBanDialog && (
        <BanUserDialog
          isOpen={true}
          onClose={() => setShowBanDialog(null)}
          user={showBanDialog}
          onConfirm={handleBanConfirm}
        />
      )}
    </div>
  )
}

interface UserProfileDialogProps {
  user: UserType
  onClose: () => void
  onTalkToMe: () => void
}

function UserProfileDialog({ user, onClose, onTalkToMe }: UserProfileDialogProps) {
  const [activeTab, setActiveTab] = useState<"hired" | "published">("hired")

  // Sample agent data with logos and free status
  const hiredAgents = [
    {
      id: "agent-1",
      name: "Debt Collect Emma",
      type: "Finance",
      logo: "💰",
      isFree: true,
    },
    {
      id: "agent-2",
      name: "Customer Support Bot",
      type: "Support",
      logo: "🎧",
      isFree: true,
    },
    {
      id: "agent-3",
      name: "Sales Assistant Pro",
      type: "Sales",
      logo: "📊",
      isFree: true,
    },
    {
      id: "agent-4",
      name: "Data Analyst AI",
      type: "Analytics",
      logo: "📈",
      isFree: true,
    },
  ]

  const publishedAgents = [
    {
      id: "agent-5",
      name: "Email Composer",
      type: "Productivity",
      logo: "✉️",
      isFree: true,
    },
    {
      id: "agent-6",
      name: "Meeting Scheduler",
      type: "Organization",
      logo: "📅",
      isFree: true,
    },
    {
      id: "agent-7",
      name: "Code Review Helper",
      type: "Development",
      logo: "💻",
      isFree: true,
    },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h3 className="text-xl font-bold">{user.name}</h3>
            <div className="text-sm text-gray-400 mb-2">{user.role || "Member"}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              onClick={onTalkToMe}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Talk to me
            </Button>
          </div>

          <div className="w-full mt-4">
            <div className="flex border-b border-[#333]">
              <button
                className={`pb-2 px-4 text-sm font-medium ${
                  activeTab === "hired"
                    ? "text-purple-500 border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("hired")}
              >
                Agents Hired
              </button>
              <button
                className={`pb-2 px-4 text-sm font-medium ${
                  activeTab === "published"
                    ? "text-purple-500 border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("published")}
              >
                Agents Published
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "hired" ? (
                <div className="space-y-3">
                  {hiredAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-md cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-700 rounded-md flex items-center justify-center text-lg">
                          {agent.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{agent.name}</span>
                            {agent.isFree && (
                              <span className="text-xs text-white bg-purple-600 px-2 py-0.5 rounded-full">Free</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{agent.type}</div>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {publishedAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-md cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-700 rounded-md flex items-center justify-center text-lg">
                          {agent.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{agent.name}</span>
                            {agent.isFree && (
                              <span className="text-xs text-white bg-purple-600 px-2 py-0.5 rounded-full">Free</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{agent.type}</div>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
