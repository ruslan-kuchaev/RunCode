"use client"

import * as React from "react"
import { useRef, useEffect, useState } from "react"
import TaskCard from "./TaskCard"
import { Button } from "@/components/ui/Button/Button"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Loader2 } from "lucide-react"
import type { Task } from "@/features/tasks/types/tasks.types"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface TaskListProps {
  tasks: Task[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  className?: string
}

export default function TaskList({
  tasks,
  loading = false,
  hasMore = false,
  onLoadMore,
  className,
}: TaskListProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [animatedCards, setAnimatedCards] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!gridRef.current || tasks.length === 0) return

    const cards = gridRef.current.querySelectorAll("[data-task-card]")
    
    cards.forEach((card, index) => {
      const taskId = card.getAttribute("data-task-id")
      
      // Skip if already animated
      if (taskId && animatedCards.has(taskId)) return

      // Set initial state
      gsap.set(card, {
        opacity: 0,
        y: 30,
      })

      // Create scroll trigger animation
      ScrollTrigger.create({
        trigger: card,
        start: "top bottom-=100",
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.05,
            ease: "power2.out",
            onComplete: () => {
              if (taskId) {
                setAnimatedCards((prev) => new Set(prev).add(taskId))
              }
            },
          })
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [tasks, animatedCards])

  if (tasks.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">Задачи не найдены</h3>
        <p className="text-muted-foreground">
          Попробуйте изменить фильтры или поисковый запрос
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Task Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            data-task-card
            data-task-id={task.id}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            Загрузить еще
          </Button>
        </div>
      )}

      {/* End Message */}
      {!hasMore && tasks.length > 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          Все задачи загружены
        </div>
      )}
    </div>
  )
}
