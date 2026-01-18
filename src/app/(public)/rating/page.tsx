'use client';

import { useState } from 'react';
import LightRays from '@/components/shared/LightRays';
import FPSCounter from "@/components/debug/FpsCounter";
import CacheDebug from "@/components/debug/CacheDebug";
import { 
    UserProfileModal, 
    RatingStats, 
    RatingFilters, 
    TopThreeUsers,
    RemainingUsersList,
    RatingSearch,
    BasicFilters,
    RatingHeader
} from '@/components/features/rating';
import { useRating, type RatingUser } from '@/hooks/useRating';

export default function RatingPage() {
    const { 
        users, 
        stats, 
        filters, 
        loading, 
        error, 
        fromCache,
        updateFilters 
    } = useRating();
    
    const [selectedUser, setSelectedUser] = useState<RatingUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const handleUserClick = (user: RatingUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handlePeriodChange = (period: 'week' | 'month' | 'all') => {
        updateFilters({ period });
    };

    const handleSortChange = (sortBy: 'points' | 'tasks' | 'streak' | 'joined') => {
        updateFilters({ sortBy });
    };

    const handleSortOrderChange = (sortOrder: 'asc' | 'desc') => {
        updateFilters({ sortOrder });
    };

    const handleLevelFilterChange = (level: string) => {
        updateFilters({ level });
    };

    const handleSearchChange = (search: string) => {
        updateFilters({ search });
    };

    if (loading && !fromCache) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Загрузка рейтинга...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-4">Ошибка загрузки</h1>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -20,
                }}
            >
                <FPSCounter />
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#ffd700"
                    raysSpeed={1.2}
                    lightSpread={2.5}
                    rayLength={1.8}
                    followMouse={false}
                    mouseInfluence={0.1}
                    noiseAmount={0.05}
                    distortion={0.03}
                    className="custom-rays z-10"
                />
            </div>

            <section className="w-full min-h-screen relative z-10">
                <div className="container mx-auto px-4 py-16">
                    <RatingHeader />

                    <RatingSearch
                        searchQuery={filters.search}
                        onSearchChange={handleSearchChange}
                    />

                    <BasicFilters
                        selectedPeriod={filters.period}
                        onPeriodChange={handlePeriodChange}
                        showAdvancedFilters={showAdvancedFilters}
                        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    />

                    {showAdvancedFilters && (
                        <RatingFilters
                            selectedPeriod={filters.period}
                            onPeriodChange={handlePeriodChange}
                            sortBy={filters.sortBy}
                            onSortChange={handleSortChange}
                            sortOrder={filters.sortOrder}
                            onSortOrderChange={handleSortOrderChange}
                            levelFilter={filters.level}
                            onLevelFilterChange={handleLevelFilterChange}
                        />
                    )}

                    <RatingStats users={users} />

                    <TopThreeUsers users={users} onUserClick={handleUserClick} />

                    {users.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-xl">Пользователи не найдены</p>
                        </div>
                    ) : (
                        <RemainingUsersList users={users} onUserClick={handleUserClick} />
                    )}

                    <footer className="border-t border-gray-800 mt-16">
                        <div className="container mx-auto px-4 py-8">
                            <div className="text-center text-gray-500">
                                <p>&copy; 2025 RunCode. Interactive programming trainer platform.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </section>

            <UserProfileModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />

            <CacheDebug />
        </>
    );
}