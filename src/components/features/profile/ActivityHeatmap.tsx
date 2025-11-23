'use client';

import React, { useMemo } from 'react';
import { Tooltip } from '@/components/ui/Tooltip';
import { useFadeIn } from '@/hooks/useFadeIn';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const containerRef = useFadeIn<HTMLDivElement>({ duration: 0.8, delay: 0.2 });

  // Generate last 365 days
  const days = useMemo(() => {
    const result: Array<{ date: Date; count: number }> = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const activity = data.find(d => d.date === dateStr);
      result.push({
        date,
        count: activity?.count || 0,
      });
    }
    
    return result;
  }, [data]);

  // Group by weeks
  const weeks = useMemo(() => {
    const result: Array<Array<{ date: Date; count: number }>> = [];
    let currentWeek: Array<{ date: Date; count: number }> = [];
    
    days.forEach((day, index) => {
      if (index % 7 === 0 && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    
    return result;
  }, [days]);

  const getIntensityColor = (count: number): string => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 2) return 'bg-green-900';
    if (count <= 4) return 'bg-green-700';
    if (count <= 6) return 'bg-green-500';
    return 'bg-green-400';
  };

  const getIntensityLabel = (count: number): string => {
    if (count === 0) return 'No activity';
    if (count <= 2) return 'Low activity';
    if (count <= 4) return 'Medium activity';
    if (count <= 6) return 'High activity';
    return 'Very high activity';
  };

  return (
    <div ref={containerRef} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Activity Heatmap</h2>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => {
              const dateStr = day.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              
              return (
                <Tooltip
                  key={dayIndex}
                  content={`${dateStr}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`}
                >
                  <div
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(day.count)} hover:ring-2 hover:ring-gray-500 transition-all cursor-pointer`}
                    title={`${dateStr}: ${day.count} contributions`}
                  />
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

