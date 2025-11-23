"use client"

import * as React from "react"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card"
import { Badge } from "@/components/ui/Badge/Badge"
import Progress from "@/components/ui/Progress/Progress"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"
import { Check, Clock, Circle } from "lucide-react"
import type { Task } from "@/features/tasks/types/tasks.types"

export interface TaskCardProps {
  task: Task
  onClick?: () => void
}

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-600 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Hard: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Expert: "bg-red-500/10 text-red-600 border-red-500/20",
}

const difficultyBadgeVariants = {
  Easy: "success" as const,
  Medium: "warning" as const,
  Hard: "destructive" as const,
  Expert: "destructive" as const,
}

const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onClick }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const handleClick = () => {
      if (onClick) {
        onClick()
      } else {
        router.push(`/tasks/${task.slug}`)
      }
    }

    const handleMouseEnter = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -8,
          scale: 1.02,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const handleMouseLeave = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: 0,
          scale: 1,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const getStatusIcon = () => {
      if (task.isSolved) {
        return <Check className="w-5 h-5 text-green-600" />
      }
      if (task.isAttempted) {
        return <Clock className="w-5 h-5 text-yellow-600" />
      }
      return <Circle className="w-5 h-5 text-gray-400" />
    }

    const getStatusText = () => {
      if (task.isSolved) return "Решена"
      if (task.isAttempted) return "В процессе"
      return "Не начата"
    }

    return (
      <Card
        ref={cardRef}
        className={cn(
          "cursor-pointer transition-all duration-300 hover:border-primary/50",
          difficultyColors[task.difficulty]
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
              {task.title}
            </CardTitle>
            <div className="flex-shrink-0" title={getStatusText()}>
              {getStatusIcon()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Difficulty Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={difficultyBadgeVariants[task.difficulty]}>
              {task.difficulty}
            </Badge>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {task.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Acceptance Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Acceptance Rate</span>
              <span className="font-medium">{task.acceptanceRate.toFixed(1)}%</span>
            </div>
            <Progress 
              value={task.acceptanceRate} 
              max={100}
              className="h-1.5"
            />
          </div>

          {/* Submissions Count */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Submissions</span>
            <span className="font-medium">{task.totalSubmissions.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    )
  }
)

TaskCard.displayName = "TaskCard"

export default TaskCard
