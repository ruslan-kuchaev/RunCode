"use client"

import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/Input/Input"
import { Badge } from "@/components/ui/Badge/Badge"
import { Button } from "@/components/ui/Button/Button"
import { Dropdown } from "@/components/ui/Dropdown/Dropdown"
import { cn } from "@/lib/utils"
import { Search, Filter, X, Check } from "lucide-react"
import type { Difficulty } from "@/features/tasks/types/tasks.types"

export interface TaskFilterState {
  search: string
  difficulties: Difficulty[]
  tags: string[]
  status: ("solved" | "attempted" | "not-started")[]
}

export interface TaskFilterProps {
  filters: TaskFilterState
  onFiltersChange: (filters: TaskFilterState) => void
  availableTags?: string[]
  className?: string
}

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard", "Expert"]
const STATUSES = [
  { value: "solved" as const, label: "Решена" },
  { value: "attempted" as const, label: "В процессе" },
  { value: "not-started" as const, label: "Не начата" },
]

const difficultyColors = {
  Easy: "success" as const,
  Medium: "warning" as const,
  Hard: "destructive" as const,
  Expert: "destructive" as const,
}

export default function TaskFilter({
  filters,
  onFiltersChange,
  availableTags = [],
  className,
}: TaskFilterProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value })
  }

  const toggleDifficulty = (difficulty: Difficulty) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter((d) => d !== difficulty)
      : [...filters.difficulties, difficulty]
    onFiltersChange({ ...filters, difficulties: newDifficulties })
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]
    onFiltersChange({ ...filters, tags: newTags })
  }

  const toggleStatus = (status: "solved" | "attempted" | "not-started") => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    onFiltersChange({ ...filters, status: newStatus })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      difficulties: [],
      tags: [],
      status: [],
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.difficulties.length > 0 ||
    filters.tags.length > 0 ||
    filters.status.length > 0

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Поиск задач по названию..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Difficulty Filter */}
        <Dropdown
          trigger={
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Сложность
              {filters.difficulties.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {filters.difficulties.length}
                </Badge>
              )}
            </Button>
          }
        >
          <div className="p-2 space-y-1 min-w-[180px]">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => toggleDifficulty(difficulty)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  filters.difficulties.includes(difficulty) && "bg-accent"
                )}
              >
                <span>{difficulty}</span>
                {filters.difficulties.includes(difficulty) && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <Dropdown
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Теги
                {filters.tags.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {filters.tags.length}
                  </Badge>
                )}
              </Button>
            }
          >
            <div className="p-2 space-y-1 min-w-[200px] max-h-[300px] overflow-y-auto">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    filters.tags.includes(tag) && "bg-accent"
                  )}
                >
                  <span>{tag}</span>
                  {filters.tags.includes(tag) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </Dropdown>
        )}

        {/* Status Filter */}
        <Dropdown
          trigger={
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Статус
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          }
        >
          <div className="p-2 space-y-1 min-w-[180px]">
            {STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => toggleStatus(status.value)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  filters.status.includes(status.value) && "bg-accent"
                )}
              >
                <span>{status.label}</span>
                {filters.status.includes(status.value) && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            Очистить
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.difficulties.map((difficulty) => (
            <Badge
              key={difficulty}
              variant={difficultyColors[difficulty]}
              className="gap-1 cursor-pointer"
              onClick={() => toggleDifficulty(difficulty)}
            >
              {difficulty}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          {filters.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="gap-1 cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          {filters.status.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => toggleStatus(status)}
            >
              {STATUSES.find((s) => s.value === status)?.label}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
