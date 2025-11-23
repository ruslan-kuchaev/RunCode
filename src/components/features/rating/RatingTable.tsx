"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { UserRatingCard, type UserRatingCardProps } from "./UserRatingCard"
import { useRouter } from "next/navigation"

export interface RatingTableProps {
  users: Omit<UserRatingCardProps, "onClick">[]
  currentUserId?: string
  isLoading?: boolean
  className?: string
}

const RatingTable = React.forwardRef<HTMLDivElement, RatingTableProps>(
  ({ users, currentUserId, isLoading = false, className, ...props }, ref) => {
    const router = useRouter()
    const [animatedRanks, setAnimatedRanks] = React.useState<Set<number>>(new Set())

    // Animate position changes
    React.useEffect(() => {
      const changedRanks = users
        .filter((user) => user.change !== undefined && user.change !== 0)
        .map((user) => user.rank)
      
      setAnimatedRanks(new Set(changedRanks))
      
      const timer = setTimeout(() => {
        setAnimatedRanks(new Set())
      }, 1000)
      
      return () => clearTimeout(timer)
    }, [users])

    const handleUserClick = (userId: string) => {
      router.push(`/profile/${userId}`)
    }

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col gap-3", className)}
          {...props}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )
    }

    if (users.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex min-h-[400px] items-center justify-center rounded-lg border border-dashed",
            className
          )}
          {...props}
        >
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Пользователи не найдены
            </p>
            <p className="text-sm text-muted-foreground">
              Проверьте позже для обновления рейтинга
            </p>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {users.map((user, index) => {
          const isCurrentUser = currentUserId === user.userId
          const hasAnimation = animatedRanks.has(user.rank)

          return (
            <div
              key={user.userId}
              className={cn(
                "transition-all duration-500",
                hasAnimation && "animate-in slide-in-from-left-5"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <UserRatingCard
                {...user}
                isCurrentUser={isCurrentUser}
                onClick={() => handleUserClick(user.userId)}
              />
            </div>
          )
        })}
      </div>
    )
  }
)

RatingTable.displayName = "RatingTable"

export { RatingTable }
