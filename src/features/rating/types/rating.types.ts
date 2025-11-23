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

export type RatingPeriod = "week" | "month" | "all"
