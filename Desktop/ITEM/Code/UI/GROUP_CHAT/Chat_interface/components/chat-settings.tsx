"use client"

import type React from "react"

import { useState } from "react"
import { X, Clock, Lock, Ban, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface ChatSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatSettings({ isOpen, onClose }: ChatSettingsProps) {
  const [permissionSetting, setPermissionSetting] = useState("all")
  const [cooldownSetting, setCooldownSetting] = useState("0")
  const [keywords, setKeywords] = useState<string[]>(["赚钱", "邀请码", "http://"])
  const [newKeyword, setNewKeyword] = useState("")

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const handleSave = () => {
    toast({
      title: "设置已保存",
      description: "聊天设置已成功更新",
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="h-full w-full bg-[#121212] border-l border-[#333] flex flex-col">
      <div className="flex items-center justify-between border-b border-[#333] p-4">
        <h2 className="text-lg font-semibold">Chat Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto flex-1">
        {/* Permission Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            <h3 className="font-medium">Who can send messages?</h3>
          </div>
          <RadioGroup value={permissionSetting} onValueChange={setPermissionSetting} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all"> All members</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="owner-admin" id="owner-admin" />
              <Label htmlFor="owner-admin">Agent owner and admins</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin-only" id="admin-only" />
              <Label htmlFor="admin-only">Agent owner only</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Cooldown Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <h3 className="font-medium">Message sending interval</h3>
          </div>
          <Select value={cooldownSetting} onValueChange={setCooldownSetting}>
            <SelectTrigger className="w-full bg-[#121212] border-[#333]">
              <SelectValue placeholder="选择冷却时间" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333]">
              <SelectItem value="0">Off</SelectItem>
              <SelectItem value="5">5s</SelectItem>
              <SelectItem value="10">10s</SelectItem>
              <SelectItem value="30">30s</SelectItem>
              <SelectItem value="60">60s</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Keyword Filtering */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-gray-400" />
            <h3 className="font-medium">Keyword filter</h3>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter keywords (e.g. money-making, invitation link）"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-[#121212] border-[#333]"
            />
            <Button variant="outline" size="icon" onClick={handleAddKeyword}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Messages containing the following keywords will be automatically blocked by the system:
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((keyword) => (
              <div key={keyword} className="flex items-center gap-1 bg-gray-800 text-sm rounded-full px-3 py-1">
                <span>{keyword}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full hover:bg-gray-700"
                  onClick={() => handleRemoveKeyword(keyword)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
