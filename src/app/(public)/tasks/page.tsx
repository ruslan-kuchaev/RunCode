"use client"

import * as React from "react"
import { useMemo, useEffect } from "react"
import TaskFilter from "@/components/features/tasks/TaskFilter"
import TaskList from "@/components/features/tasks/TaskList"
import TaskProgress from "@/components/features/tasks/TaskProgress"
import { useTasks } from "@/features/tasks/hooks/useTasks"
import type { TaskProgressStats } from "@/components/features/tasks/TaskProgress"
import { useFadeIn } from "@/hooks/useFadeIn"

export default function TasksPage() {
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    setFilters,
    hasMore,
    loadMore,
  } = useTasks()

  // Animation refs
  const headerRef = useFadeIn<HTMLDivElement>({ duration: 0.6, delay: 0.1, y: 20 })
  const progressRef = useFadeIn<HTMLDivElement>({ duration: 0.6, delay: 0.2, y: 20 })
  const filtersRef = useFadeIn<HTMLDivElement>({ duration: 0.6, delay: 0.3, y: 20 })

  // Calculate progress stats
  const progressStats = useMemo<TaskProgressStats>(() => {
    const stats: TaskProgressStats = {
      total: tasks.length,
      solved: tasks.filter((t) => t.isSolved).length,
      byDifficulty: {
        Easy: { total: 0, solved: 0 },
        Medium: { total: 0, solved: 0 },
        Hard: { total: 0, solved: 0 },
        Expert: { total: 0, solved: 0 },
      },
    }

    tasks.forEach((task) => {
      stats.byDifficulty[task.difficulty].total++
      if (task.isSolved) {
        stats.byDifficulty[task.difficulty].solved++
      }
    })

    return stats
  }, [tasks])

  // Get unique tags from all tasks
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>()
    tasks.forEach((task) => {
      task.tags.forEach((tag) => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  }, [tasks])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Ошибка загрузки задач</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {error.message || "Не удалось загрузить список задач. Пожалуйста, попробуйте позже."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  // Initial loading state
  if (loading && tasks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Загрузка задач...</p>
        </div>
      </div>
    )
  }

  const hasActiveFilters = 
    filters.search || 
    filters.difficulties.length > 0 || 
    filters.tags.length > 0 || 
    filters.status.length > 0

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 pb-16">
      {/* Header */}
      <div ref={headerRef} className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Задачи
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
          Решайте задачи по программированию, улучшайте свои навыки и соревнуйтесь с другими разработчиками
        </p>
      </div>

      {/* Progress Section */}
      <div ref={progressRef}>
        <TaskProgress stats={progressStats} />
      </div>

      {/* Filters */}
      <div ref={filtersRef}>
        <TaskFilter
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={availableTags}
        />
      </div>

      {/* Results Count and Clear Filters */}
      {!loading && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Найдено задач:{" "}
            <span className="font-semibold text-foreground text-base">
              {filteredTasks.length}
            </span>
            {hasActiveFilters && (
              <span className="ml-1">из {tasks.length} всего</span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  difficulties: [],
                  tags: [],
                  status: [],
                })
              }
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Задачи не найдены</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {hasActiveFilters
              ? "Попробуйте изменить параметры фильтрации"
              : "В данный момент нет доступных задач"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  difficulties: [],
                  tags: [],
                  status: [],
                })
              }
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length > 0 && (
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}
    </div>
  )
}
