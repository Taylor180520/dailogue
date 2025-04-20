import type React from "react"
import { Search, Database, Users, MessageSquare } from "lucide-react"

export function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-60 h-full bg-[#121212] border-r border-[#333] z-20">
      <div className="flex items-center gap-2 p-4 h-[60px] border-b border-[#333]">
        <div className="h-6 w-6 bg-[#333] rounded-md flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
        <span className="font-bold text-lg">AGENT</span>
      </div>

      <div className="py-4">
        <MenuItem icon={<Search className="h-5 w-5" />} label="Discover" />
        <MenuItem icon={<Database className="h-5 w-5" />} label="Resource" />
        <MenuItem icon={<Users className="h-5 w-5" />} label="My Agents" />
        <MenuItem icon={<MessageSquare className="h-5 w-5" />} label="My Chats" active={true} />
      </div>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
}

function MenuItem({ icon, label, active = false }: MenuItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-md cursor-pointer transition-colors h-10 ${
        active ? "bg-[#9333ea]" : "hover:bg-[#1f1f1f]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}
