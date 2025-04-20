"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserType } from "@/lib/types"

interface ReactionUsersDialogProps {
  isOpen: boolean
  onClose: () => void
  emoji: string
  users: UserType[]
}

export function ReactionUsersDialog({ isOpen, onClose, emoji, users }: ReactionUsersDialogProps) {
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <span>Reactions ({users.length})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 py-2 border-b border-[#333] last:border-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                {user.role && <div className="text-xs text-gray-400">{user.role}</div>}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
