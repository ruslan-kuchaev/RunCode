"use client"

import { useState, useEffect, useCallback } from "react"
import type { Task, Difficulty } from "../types/tasks.types"
import type { TaskFilterState } from "@/components/features/tasks/TaskFilter"

export interface UseTasksOptions {
  initialFilters?: Partial<TaskFilterState>
  pageSize?: number
}

export interface UseTasksReturn {
  tasks: Task[]
  filteredTasks: Task[]
  loading: boolean
  error: Error | null
  filters: TaskFilterState
  setFilters: (filters: TaskFilterState) => void
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

// Mock data generator for development
const generateMockTasks = (count: number): Task[] => {
  const difficulties: Difficulty[] = ["Easy", "Medium", "Hard", "Expert"]
  const tagOptions = [
    "Arrays",
    "Strings",
    "Math",
    "Dynamic Programming",
    "Greedy",
    "Binary Search",
    "Sorting",
    "Hash Table",
    "Tree",
    "Graph",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `task-${i + 1}`,
    title: `Task ${i + 1}: ${["Two Sum", "Reverse String", "Fibonacci", "Binary Search", "Merge Sort"][i % 5]}`,
    slug: `task-${i + 1}`,
    description: `This is a description for task ${i + 1}`,
    difficulty: difficulties[i % 4],
    tags: tagOptions.slice(i % 3, (i % 3) + 3),
    examples: [],
    constraints: [],
    testCases: [],
    starterCode: {},
    acceptanceRate: Math.random() * 100,
    totalSubmissions: Math.floor(Math.random() * 10000),
    isSolved: Math.random() > 0.7,
    isAttempted: Math.random() > 0.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const { initialFilters = {}, pageSize = 12 } = options

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [filters, setFilters] = useState<TaskFilterState>({
    search: initialFilters.search || "",
    difficulties: initialFilters.difficulties || [],
    tags: initialFilters.tags || [],
    status: initialFilters.status || [],
  })

  // Fetch tasks from API
  const fetchTasks = useCallback(async (pageNum: number) => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/tasks?limit=${pageSize}&offset=${(pageNum - 1) * pageSize}`)
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке задач')
      }

      const data = await response.json()
      setTasks(data.tasks || [])
      setHasMore((data.tasks?.length || 0) === pageSize)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Ошибка при загрузке задач"))
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  // Initial load
  useEffect(() => {
    fetchTasks(1)
  }, [fetchTasks])

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (!task.title.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Difficulty filter
    if (filters.difficulties.length > 0) {
      if (!filters.difficulties.includes(task.difficulty)) {
        return false
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        task.tags.includes(tag)
      )
      if (!hasMatchingTag) {
        return false
      }
    }

    // Status filter
    if (filters.status.length > 0) {
      const matchesStatus = filters.status.some((status) => {
        if (status === "solved") return task.isSolved
        if (status === "attempted") return task.isAttempted && !task.isSolved
        if (status === "not-started") return !task.isAttempted && !task.isSolved
        return false
      })
      if (!matchesStatus) {
        return false
      }
    }

    return true
  })

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1)
      fetchTasks(page + 1)
    }
  }, [loading, hasMore, page, fetchTasks])

  const refresh = useCallback(() => {
    setPage(1)
    fetchTasks(1)
  }, [fetchTasks])

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    setFilters,
    hasMore,
    loadMore,
    refresh,
  }
}
