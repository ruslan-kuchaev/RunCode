"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ProfileHeader, ProfileStats, ActivityHeatmap } from '@/components/features/profile';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';

// Mock data - replace with actual API calls
const mockUser = {
  id: '1',
  username: 'JohnDoe',
  email: 'john@example.com',
  avatar: null,
  bio: 'Passionate developer and problem solver',
  createdAt: new Date('2024-01-15'),
};

const mockStats = {
  solvedTasks: 42,
  rating: 1850,
  streak: 7,
  longestStreak: 30,
  rank: 15,
};

const mockActivity = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (364 - i));
  return {
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 10),
  };
});

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(mockUser);
  const [stats, setStats] = useState(mockStats);
  const [activity, setActivity] = useState(mockActivity);

  // TODO: Fetch actual user data from API
  useEffect(() => {
    // Fetch user profile, stats, and activity
  }, []);

  const tabs = [
    {
      label: 'Overview',
      value: 'overview',
      content: (
        <div className="space-y-6">
          <ProfileStats stats={stats} />
          <ActivityHeatmap data={activity} />
        </div>
      ),
    },
    {
      label: 'Solutions',
      value: 'solutions',
      content: (
        <Card className="p-6">
          <p className="text-gray-400">Recent solutions will appear here</p>
        </Card>
      ),
    },
    {
      label: 'Achievements',
      value: 'achievements',
      content: (
        <Card className="p-6">
          <p className="text-gray-400">Achievements will appear here</p>
        </Card>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={user} isOwnProfile={!!session} />
      <Tabs tabs={tabs} defaultValue="overview" />
    </div>
  );
}

