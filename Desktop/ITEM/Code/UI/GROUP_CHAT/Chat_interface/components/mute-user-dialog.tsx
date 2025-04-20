"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { UserType } from "@/lib/types"

interface MuteUserDialogProps {
  isOpen: boolean
  onClose: () => void
  user: UserType
  onConfirm?: (duration: string, timeUnit: string) => void
}

export function MuteUserDialog({ isOpen, onClose, user, onConfirm }: MuteUserDialogProps) {
  const [duration, setDuration] = useState("")
  const [timeUnit, setTimeUnit] = useState("minutes")
  const [error, setError] = useState("")

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits
    if (value === "" || /^\d+$/.test(value)) {
      setDuration(value)
      setError("")
    } else {
      setError("Please enter only numbers")
    }
  }

  const handleConfirm = () => {
    if (!duration) {
      setError("Please enter a duration")
      return
    }

    toast({
      title: `${user.name} has been muted`,
      description: `User will be muted for ${duration} ${timeUnit}`,
    })

    if (onConfirm) {
      onConfirm(duration, timeUnit)
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white">
        <DialogHeader>
          <DialogTitle>Mute {user.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-400">
            Set how long you want to mute this user. They won't be able to send messages during this time.
          </p>

          <div className="flex justify-center gap-2">
            <div className="w-[140px]">
              <Input
                type="text"
                placeholder="Duration"
                value={duration}
                onChange={handleDurationChange}
                className={`bg-[#121212] border-[#333] ${error ? "border-red-500" : ""}`}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <Select value={timeUnit} onValueChange={setTimeUnit}>
              <SelectTrigger className="w-[140px] bg-[#121212] border-[#333]">
                <SelectValue placeholder="Time unit" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#333]">
                <SelectItem value="minutes">Minute(s)</SelectItem>
                <SelectItem value="hours">Hour(s)</SelectItem>
                <SelectItem value="days">Day(s)</SelectItem>
                <SelectItem value="weeks">Week(s)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-purple-600 hover:bg-purple-700">
            Confirm Mute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
