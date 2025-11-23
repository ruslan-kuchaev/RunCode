"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/Avatar/Avatar"
import { Badge } from "@/components/ui/Badge/Badge"
import { ArrowUp, ArrowDown, Minus, Trophy, Target, Flame } from "lucide-react"

export interface UserRatingCardProps {
  rank: number
  userId: string
  username: string
  avatar?: string
  rating: number
  solvedTasks: number
  streak: number
  change?: number // Position change (positive = up, negative = down, 0 = no change)
  isCurrentUser?: boolean
  onClick?: () => void
}

const UserRatingCard = React.forwardRef<HTMLDivElement, UserRatingCardProps>(
  (
    {
      rank,
      userId,
      username,
      avatar,
      rating,
      solvedTasks,
      streak,
      change = 0,
      isCurrentUser = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const getRankColor = (rank: number) => {
      if (rank === 1) return "text-yellow-500"
      if (rank === 2) return "text-gray-400"
      if (rank === 3) return "text-amber-600"
      return "text-muted-foreground"
    }

    const getRankBadge = (rank: number) => {
      if (rank <= 3) {
        return <Trophy className={cn("h-5 w-5", getRankColor(rank))} />
      }
      return null
    }

    const getChangeIndicator = () => {
      if (change > 0) {
        return (
          <div className="flex items-center gap-1 text-green-500">
            <ArrowUp className="h-4 w-4" />
            <span className="text-xs font-medium">{change}</span>
          </div>
        )
      }
      if (change < 0) {
        return (
          <div className="flex items-center gap-1 text-red-500">
            <ArrowDown className="h-4 w-4" />
            <span className="text-xs font-medium">{Math.abs(change)}</span>
          </div>
        )
      }
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Minus className="h-4 w-4" />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex items-center gap-4 rounded-lg border bg-card p-4 transition-all duration-300",
          "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
          isCurrentUser && "border-primary bg-primary/5 ring-2 ring-primary/20",
          onClick && "cursor-pointer",
          "animate-in fade-in slide-in-from-bottom-2"
        )}
        onClick={onClick}
        {...props}
      >
        {/* Rank */}
        <div className="flex w-12 flex-col items-center justify-center">
          <div className={cn("text-2xl font-bold", getRankColor(rank))}>
            {rank}
          </div>
          {getRankBadge(rank)}
        </div>

        {/* Avatar */}
        <Avatar src={avatar} alt={username} fallback={username} size="lg" />

        {/* User Info */}
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{username}</h3>
            {isCurrentUser && (
              <Badge variant="info" className="text-xs">
                You
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{solvedTasks} solved</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{streak} day streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating & Change */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-2xl font-bold text-primary">{rating}</div>
          {getChangeIndicator()}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    )
  }
)

UserRatingCard.displayName = "UserRatingCard"

export { UserRatingCard }
