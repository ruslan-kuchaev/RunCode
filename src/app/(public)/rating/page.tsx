"use client"

import * as React from "react"
import { useState } from "react"
import { Trophy, TrendingUp, Users, Award } from "lucide-react"
import {
  RatingTable,
  RatingFilters,
  type RatingPeriod,
} from "@/components/features/rating"
import { useRating } from "@/features/rating"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card"
import { Badge } from "@/components/ui/Badge/Badge"

export default function RatingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<RatingPeriod>("all")
  const { users, isLoading, error } = useRating({ period: selectedPeriod })

  // Mock current user ID - replace with actual auth
  const currentUserId = "user-5"

  const stats = React.useMemo(() => {
    if (users.length === 0) {
      return {
        totalUsers: 0,
        averageRating: 0,
        topRating: 0,
      }
    }

    return {
      totalUsers: users.length,
      averageRating: Math.round(
        users.reduce((sum, user) => sum + user.rating, 0) / users.length
      ),
      topRating: users[0]?.rating || 0,
    }
  }, [users])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Рейтинг</h1>
            <p className="text-muted-foreground">
              Соревнуйтесь с другими разработчиками и поднимайтесь в рейтинге
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Активных участников
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Средний рейтинг
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                Средний по сообществу
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Топ рейтинг</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topRating}</div>
              <p className="text-xs text-muted-foreground">
                Лучший результат
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Таблица лидеров</h2>
          <Badge variant="secondary">{users.length} пользователей</Badge>
        </div>
        <RatingFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-medium text-destructive">
                Ошибка загрузки рейтинга
              </p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Table */}
      {!error && (
        <RatingTable
          users={users}
          currentUserId={currentUserId}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
