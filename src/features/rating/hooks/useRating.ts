"use client"

import { useState, useEffect } from "react"
import type { RatingPeriod } from "@/components/features/rating"

export interface UserRating {
  rank: number
  userId: string
  username: string
  avatar?: string
  rating: number
  solvedTasks: number
  streak: number
  change?: number
}

export interface UseRatingOptions {
  period?: RatingPeriod
  limit?: number
}

export interface UseRatingReturn {
  users: UserRating[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useRating(options: UseRatingOptions = {}): UseRatingReturn {
  const { period = "all", limit = 100 } = options
  const [users, setUsers] = useState<UserRating[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRating = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/rating?period=${period}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке рейтинга')
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Ошибка при загрузке рейтинга"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRating()
  }, [period, limit])

  return {
    users,
    isLoading,
    error,
    refetch: fetchRating,
  }
}
