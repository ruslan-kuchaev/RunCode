"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card/Card"
import { Badge } from "@/components/ui/Badge/Badge"
import Progress from "@/components/ui/Progress/Progress"
import { cn } from "@/lib/utils"
import { Trophy, Target, TrendingUp, PieChart } from "lucide-react"
import type { Difficulty } from "@/features/tasks/types/tasks.types"

export interface TaskProgressStats {
  total: number
  solved: number
  byDifficulty: {
    Easy: { total: number; solved: number }
    Medium: { total: number; solved: number }
    Hard: { total: number; solved: number }
    Expert: { total: number; solved: number }
  }
}

export interface TaskProgressProps {
  stats: TaskProgressStats
  className?: string
}

const difficultyColors = {
  Easy: {
    bg: "bg-green-500/10",
    text: "text-green-600",
    progress: "bg-green-500",
    hex: "#22c55e",
  },
  Medium: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600",
    progress: "bg-yellow-500",
    hex: "#eab308",
  },
  Hard: {
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    progress: "bg-orange-500",
    hex: "#f97316",
  },
  Expert: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    progress: "bg-red-500",
    hex: "#ef4444",
  },
}

// Helper function to create pie chart path
function createPieSlice(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const startX = centerX + radius * Math.cos(startAngle)
  const startY = centerY + radius * Math.sin(startAngle)
  const endX = centerX + radius * Math.cos(endAngle)
  const endY = centerY + radius * Math.sin(endAngle)

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

  return [
    `M ${centerX} ${centerY}`,
    `L ${startX} ${startY}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    'Z',
  ].join(' ')
}

export default function TaskProgress({ stats, className }: TaskProgressProps) {
  const overallPercentage = stats.total > 0 
    ? (stats.solved / stats.total) * 100 
    : 0

  const getDifficultyPercentage = (difficulty: Difficulty) => {
    const diffStats = stats.byDifficulty[difficulty]
    return diffStats.total > 0 
      ? (diffStats.solved / diffStats.total) * 100 
      : 0
  }

  // Calculate pie chart data
  const pieChartData = React.useMemo(() => {
    const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Expert']
    const data = difficulties.map((difficulty) => ({
      difficulty,
      solved: stats.byDifficulty[difficulty].solved,
      color: difficultyColors[difficulty].hex,
    }))

    const totalSolved = data.reduce((sum, item) => sum + item.solved, 0)
    
    if (totalSolved === 0) {
      return []
    }

    let currentAngle = -Math.PI / 2 // Start from top

    return data
      .filter((item) => item.solved > 0)
      .map((item) => {
        const percentage = item.solved / totalSolved
        const angle = percentage * 2 * Math.PI
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        currentAngle = endAngle

        return {
          ...item,
          percentage: percentage * 100,
          startAngle,
          endAngle,
        }
      })
  }, [stats])

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Ваш прогресс
          </CardTitle>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {stats.solved} / {stats.total}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Общий прогресс</span>
            </div>
            <span className="text-sm font-semibold">
              {overallPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={overallPercentage} 
            max={100}
            className="h-3"
          />
        </div>

        {/* Two Column Layout: Progress Bars + Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress by Difficulty */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              По сложности
            </div>

            <div className="space-y-3">
              {(Object.keys(stats.byDifficulty) as Difficulty[]).map((difficulty) => {
                const diffStats = stats.byDifficulty[difficulty]
                const percentage = getDifficultyPercentage(difficulty)
                const colors = difficultyColors[difficulty]

                return (
                  <div
                    key={difficulty}
                    className={cn(
                      "p-3 rounded-lg border transition-all hover:shadow-sm",
                      colors.bg
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm font-medium", colors.text)}>
                          {difficulty}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {diffStats.solved} / {diffStats.total}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-1.5 py-0"
                          >
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        max={100}
                        className="h-1.5"
                        indicatorClassName={colors.progress}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pie Chart Visualization */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <PieChart className="w-4 h-4" />
              Распределение решенных задач
            </div>

            {pieChartData.length > 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* SVG Pie Chart */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-40 h-40"
                  role="img"
                  aria-label="Pie chart showing solved tasks by difficulty"
                >
                  <title>Распределение решенных задач</title>
                  {pieChartData.map((slice, index) => (
                    <g key={slice.difficulty}>
                      <path
                        d={createPieSlice(100, 100, 80, slice.startAngle, slice.endAngle)}
                        fill={slice.color}
                        className="transition-all hover:opacity-80 cursor-pointer"
                        strokeWidth="2"
                        stroke="white"
                      >
                        <title>
                          {slice.difficulty}: {slice.solved} ({slice.percentage.toFixed(1)}%)
                        </title>
                      </path>
                    </g>
                  ))}
                  {/* Center circle for donut effect */}
                  <circle
                    cx="100"
                    cy="100"
                    r="45"
                    fill="hsl(var(--background))"
                    className="pointer-events-none"
                  />
                  {/* Center text */}
                  <text
                    x="100"
                    y="95"
                    textAnchor="middle"
                    className="text-2xl font-bold fill-foreground"
                    style={{ fontSize: '24px' }}
                  >
                    {stats.solved}
                  </text>
                  <text
                    x="100"
                    y="110"
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                    style={{ fontSize: '12px' }}
                  >
                    решено
                  </text>
                </svg>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {pieChartData.map((slice) => (
                    <div
                      key={slice.difficulty}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="text-muted-foreground">
                        {slice.difficulty}: {slice.solved}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-40 h-40 rounded-full bg-muted/20 flex items-center justify-center mb-3">
                  <PieChart className="w-12 h-12 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Начните решать задачи, чтобы увидеть статистику
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
