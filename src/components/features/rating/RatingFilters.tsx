"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button/Button"
import { Calendar, TrendingUp } from "lucide-react"

export type RatingPeriod = "week" | "month" | "all"

export interface RatingFiltersProps {
  selectedPeriod: RatingPeriod
  onPeriodChange: (period: RatingPeriod) => void
  className?: string
}

const periodOptions: { value: RatingPeriod; label: string; icon?: React.ReactNode }[] = [
  { value: "week", label: "Week", icon: <Calendar className="h-4 w-4" /> },
  { value: "month", label: "Month", icon: <Calendar className="h-4 w-4" /> },
  { value: "all", label: "All Time", icon: <TrendingUp className="h-4 w-4" /> },
]

const RatingFilters = React.forwardRef<HTMLDivElement, RatingFiltersProps>(
  ({ selectedPeriod, onPeriodChange, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-card p-2",
          className
        )}
        {...props}
      >
        <span className="px-2 text-sm font-medium text-muted-foreground">
          Period:
        </span>
        <div className="flex gap-1">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedPeriod === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onPeriodChange(option.value)}
              className={cn(
                "gap-2 transition-all duration-200",
                selectedPeriod === option.value && "shadow-md"
              )}
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    )
  }
)

RatingFilters.displayName = "RatingFilters"

export { RatingFilters }
