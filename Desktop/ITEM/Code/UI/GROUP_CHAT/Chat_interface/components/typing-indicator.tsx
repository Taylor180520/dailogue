import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TypingIndicatorProps {
  user: {
    name: string
    avatar: string
  }
}

export function TypingIndicator({ user }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-gray-400 text-sm">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex items-center">
        <span>{user.name} is typing</span>
        <span className="ml-1 flex">
          <span className="animate-bounce mx-0.5 delay-0">.</span>
          <span className="animate-bounce mx-0.5 delay-150">.</span>
          <span className="animate-bounce mx-0.5 delay-300">.</span>
        </span>
      </div>
    </div>
  )
}
