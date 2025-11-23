'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Trophy, CheckCircle, Flame, TrendingUp } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';

interface ProfileStatsProps {
  stats: {
    solvedTasks: number;
    rating: number;
    streak: number;
    longestStreak: number;
    rank?: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const cardRefs = [
    useFadeIn<HTMLDivElement>({ duration: 0.6, delay: 0.1 }),
    useFadeIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 }),
    useFadeIn<HTMLDivElement>({ duration: 0.6, delay: 0.3 }),
    useFadeIn<HTMLDivElement>({ duration: 0.6, delay: 0.4 }),
  ];

  const statCards = [
    {
      icon: CheckCircle,
      label: 'Solved Tasks',
      value: stats.solvedTasks,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Trophy,
      label: 'Rating',
      value: stats.rating,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.streak} days`,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            ref={cardRefs[index]}
            className={`${stat.bgColor} border-gray-700/50 hover:border-gray-600/50 transition-all duration-300`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

