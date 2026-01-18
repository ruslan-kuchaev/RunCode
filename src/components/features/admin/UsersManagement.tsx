'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAdminUsers, type UserRole, type UserStatus } from '@/hooks/useAdminUsers';
import { 
    Search, 
    Trash2, 
    Ban,
    CheckCircle,
    XCircle,
    Users,
    Crown,
    Shield,
    Eye,
    Mail,
    Calendar,
    Award,
    AlertTriangle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function UsersManagement() {
    const { 
        users, 
        pagination,
        filters,
        loading, 
        error, 
        setFilters,
        blockUser,
        deleteUser,
        changeUserRole
    } = useAdminUsers();
    
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (containerRef.current) {
            const elements = containerRef.current.querySelectorAll('.animate-item');
            gsap.set(elements, { opacity: 0, y: 20 });
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    }, []);

    const handleSearchChange = (value: string) => {
        setFilters({ ...filters, search: value, page: 1 });
    };

    const handleRoleChange = (role: UserRole | 'ALL') => {
        setFilters({ ...filters, role, page: 1 });
    };

    const handleStatusChange = (status: UserStatus | 'ALL') => {
        setFilters({ ...filters, status, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ ...filters, page });
    };

    const handleBlockUser = async (userId: number, currentStatus: UserStatus) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const willBlock = currentStatus !== 'BLOCKED';
        const action = willBlock ? 'заблокировать' : 'разблокировать';
        
        if (confirm(`Вы уверены, что хотите ${action} пользователя "${user.username}"?`)) {
            setIsSubmitting(true);
            try {
                await blockUser(userId, willBlock);
            } catch (error: any) {
                alert(error.message || 'Ошибка при изменении статуса пользователя');
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        if (user.role === 'ADMIN') {
            alert('Нельзя удалить администратора');
            return;
        }

        if (confirm(`Вы уверены, что хотите удалить пользователя "${user.username}"? Это действие нельзя отменить.`)) {
            setIsSubmitting(true);
            try {
                await deleteUser(userId);
            } catch (error: any) {
                alert(error.message || 'Ошибка при удалении пользователя');
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChangeRole = async (userId: number, newRole: UserRole) => {
        if (confirm(`Изменить роль пользователя на "${newRole}"?`)) {
            setIsSubmitting(true);
            try {
                await changeUserRole(userId, newRole);
            } catch (error: any) {
                alert(error.message || 'Ошибка при изменении роли пользователя');
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Загрузка пользователей...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400">Ошибка загрузки пользователей</p>
                    <p className="text-gray-400 text-sm mt-2">Попробуйте обновить страницу</p>
                </div>
            </div>
        );
    }

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'MODERATOR': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            case 'USER': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'ADMIN': return Crown;
            case 'MODERATOR': return Shield;
            case 'USER': return Users;
        }
    };

    const getStatusColor = (status: UserStatus) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'BLOCKED': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
        }
    };

    const getStatusLabel = (status: UserStatus) => {
        switch (status) {
            case 'ACTIVE': return 'Активен';
            case 'BLOCKED': return 'Заблокирован';
            case 'PENDING': return 'Ожидает';
        }
    };

    const handleDeleteUserSolutions = async (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        // This would need a separate API endpoint to clear user solutions
        // For now, just show a message
        alert('Функция очистки решений пользователя будет добавлена в следующем обновлении');
    };

    return (
        <div ref={containerRef} className="space-y-6">
            {/* Header */}
            <div className="animate-item flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Управление пользователями</h1>
                    <p className="text-gray-400">Просматривайте и управляйте пользователями системы</p>
                </div>
            </div>

            {/* Stats */}
            <div className="animate-item grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-blue-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{pagination.total}</div>
                            <div className="text-sm text-gray-400">Всего пользователей</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{users.filter(u => u.status === 'ACTIVE').length}</div>
                            <div className="text-sm text-gray-400">Активных</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <XCircle className="w-8 h-8 text-red-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{users.filter(u => u.status === 'BLOCKED').length}</div>
                            <div className="text-sm text-gray-400">Заблокированных</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Award className="w-8 h-8 text-yellow-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{users.reduce((sum, u) => sum + u.totalPoints, 0)}</div>
                            <div className="text-sm text-gray-400">Общие очки</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="animate-item bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск пользователей..."
                            value={filters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                        />
                    </div>

                    {/* Role filter */}
                    <select
                        value={filters.role}
                        onChange={(e) => handleRoleChange(e.target.value as UserRole | 'ALL')}
                        className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                    >
                        <option value="ALL">Все роли</option>
                        <option value="USER">Пользователь</option>
                        <option value="MODERATOR">Модератор</option>
                        <option value="ADMIN">Администратор</option>
                    </select>

                    {/* Status filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => handleStatusChange(e.target.value as UserStatus | 'ALL')}
                        className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                    >
                        <option value="ALL">Все статусы</option>
                        <option value="ACTIVE">Активные</option>
                        <option value="BLOCKED">Заблокированные</option>
                        <option value="PENDING">Ожидающие</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="animate-item bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Пользователь</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Роль</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Статус</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Статистика</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Регистрация</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {users.map((user) => {
                                const RoleIcon = getRoleIcon(user.role);
                                return (
                                    <tr key={user.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                                                    {user.avatar ? (
                                                        <img 
                                                            src={user.avatar} 
                                                            alt={user.username}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-orange-400 font-semibold">
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.username}</div>
                                                    <div className="text-sm text-gray-400 flex items-center space-x-2">
                                                        <Mail className="w-3 h-3" />
                                                        <span>{user.email}</span>
                                                        {user.isEmailVerified && (
                                                            <CheckCircle className="w-3 h-3 text-green-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group">
                                                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                                    <RoleIcon className="w-3 h-3" />
                                                    <span>{user.role}</span>
                                                </span>
                                                
                                                {/* Role change dropdown */}
                                                <div className="absolute top-full left-0 mt-1 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999]">
                                                    <div className="p-1">
                                                        {(['USER', 'MODERATOR', 'ADMIN'] as UserRole[]).map((role) => (
                                                            <button
                                                                key={role}
                                                                onClick={() => handleChangeRole(user.id, role)}
                                                                disabled={isSubmitting}
                                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 ${
                                                                    user.role === role 
                                                                        ? 'bg-orange-500/20 text-orange-400' 
                                                                        : 'text-gray-300 hover:bg-gray-700/50'
                                                                }`}
                                                            >
                                                                {role}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                                {getStatusLabel(user.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm space-y-1">
                                                <div className="text-green-400">{user.solvedTasks} решений</div>
                                                <div className="text-yellow-400">{user.totalPoints} очков</div>
                                                <div className="text-gray-400">{user.totalAttempts} попыток</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="mt-1">
                                                    Последний вход: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Никогда'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                                                    title="Просмотр профиля"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleBlockUser(user.id, user.status)}
                                                    disabled={isSubmitting}
                                                    className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                                                        user.status === 'BLOCKED'
                                                            ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                                            : 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                                                    }`}
                                                    title={user.status === 'BLOCKED' ? 'Разблокировать' : 'Заблокировать'}
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUserSolutions(user.id)}
                                                    disabled={isSubmitting}
                                                    className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                                                    title="Удалить решения"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={user.role === 'ADMIN' || isSubmitting}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Удалить пользователя"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="animate-item flex items-center justify-between bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="text-sm text-gray-400">
                        Показано {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total} пользователей
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            const page = i + Math.max(1, pagination.page - 2);
                            if (page > pagination.pages) return null;
                            
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                        page === pagination.page
                                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {users.length === 0 && (
                <div className="animate-item text-center py-12">
                    <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-400 mb-2">Пользователи не найдены</h3>
                    <p className="text-gray-500">Попробуйте изменить фильтры поиска</p>
                </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9998]">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Профиль пользователя</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* User Info */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-orange-400 font-semibold text-xl">
                                        {selectedUser.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{selectedUser.username}</h3>
                                    <p className="text-gray-400">{selectedUser.email}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-1 rounded text-xs ${getRoleColor(selectedUser.role)}`}>
                                            {selectedUser.role}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedUser.status)}`}>
                                            {getStatusLabel(selectedUser.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-400">{selectedUser.solvedTasks}</div>
                                    <div className="text-sm text-gray-400">Решений</div>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-yellow-400">{selectedUser.totalPoints}</div>
                                    <div className="text-sm text-gray-400">Очков</div>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-400">{selectedUser.totalAttempts}</div>
                                    <div className="text-sm text-gray-400">Попыток</div>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-400">
                                        {selectedUser.totalAttempts > 0 ? Math.round((selectedUser.solvedTasks / selectedUser.totalAttempts) * 100) : 0}%
                                    </div>
                                    <div className="text-sm text-gray-400">Успешность</div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Email подтвержден:</span>
                                    <span className={selectedUser.isEmailVerified ? 'text-green-400' : 'text-red-400'}>
                                        {selectedUser.isEmailVerified ? 'Да' : 'Нет'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Страна:</span>
                                    <span className="text-white">{selectedUser.country || 'Не указана'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Дата регистрации:</span>
                                    <span className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Последний вход:</span>
                                    <span className="text-white">{selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleDateString() : 'Никогда'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}