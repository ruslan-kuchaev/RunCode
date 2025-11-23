'use client';

import React, { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Edit2, Camera } from 'lucide-react';

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string | null;
    bio?: string | null;
    createdAt: Date;
  };
  isOwnProfile?: boolean;
}

export function ProfileHeader({ user, isOwnProfile = false }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    console.log('Avatar upload');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative group">
          <Avatar
            src={user.avatar || undefined}
            alt={user.username}
            size="xl"
            className="ring-4 ring-gray-700"
          />
          {isOwnProfile && (
            <button
              onClick={handleAvatarUpload}
              className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
          
          <p className="text-gray-400 mb-2">{user.email}</p>
          
          {user.bio && (
            <p className="text-gray-300 mb-4">{user.bio}</p>
          )}
          
          <p className="text-sm text-gray-500">
            Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

