"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import type { UserType } from "@/lib/types"

interface BanUserDialogProps {
  isOpen: boolean
  onClose: () => void
  user: UserType
  onConfirm?: () => void
}

export function BanUserDialog({ isOpen, onClose, user, onConfirm }: BanUserDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }

    toast({
      title: `${user.name} has been banned`,
      description: "User has been removed from the group chat",
      variant: "destructive",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white">
        <DialogHeader>
          <DialogTitle>Ban {user.name}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm">
            This action will remove <span className="font-semibold">{user.name}</span> immediately from the group chat.
            They won't be able to rejoin unless unbanned.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
            Confirm Ban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
