'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguages } from '@/hooks/useLanguages';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Code,
    FileText,
    Users,
    Settings,
    Upload,
    X,
    AlertTriangle
} from 'lucide-react';

interface Language {
    id: number;
    name: string;
    icon: string;
    extension: string;
    monacoLanguage: string;
    isActive: boolean;
    tasksCount: number;
    usersCount: number;
    createdAt: Date;
    updatedAt: Date;
}

interface LanguagesManagementProps {
    autoOpenCreateModal?: boolean;
    onModalClose?: () => void;
}

export default function LanguagesManagement({ autoOpenCreateModal = false, onModalClose }: LanguagesManagementProps) {
    const { 
        languages, 
        loading, 
        error, 
        createLanguage, 
        updateLanguage, 
        deleteLanguage, 
        toggleLanguageActive 
    } = useLanguages();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
    const [newLanguage, setNewLanguage] = useState({
        name: '',
        icon: '',
        extension: '',
        monacoLanguage: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Auto-open create modal if requested
    useEffect(() => {
        if (autoOpenCreateModal) {
            setShowCreateModal(true);
        }
    }, [autoOpenCreateModal]);

    const filteredLanguages = languages.filter(lang => 
        searchQuery === '' || 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.extension.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                alert('Пожалуйста, выберите файл PNG, JPG или SVG');
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Размер файла не должен превышать 2MB');
                return;
            }

            setImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteLanguage = async (languageId: number) => {
        const language = languages.find(l => l.id === languageId);
        if (language && language.tasksCount > 0) {
            alert(`Нельзя удалить язык "${language.name}", так как он используется в ${language.tasksCount} заданиях.`);
            return;
        }
        
        if (confirm('Вы уверены, что хотите удалить этот язык программирования?')) {
            try {
                await deleteLanguage(languageId);
            } catch (error) {
                alert('Ошибка при удалении языка');
                console.error(error);
            }
        }
    };

    const handleToggleActive = async (languageId: number) => {
        const language = languages.find(l => l.id === languageId);
        if (language) {
            try {
                await toggleLanguageActive(languageId, !language.isActive);
            } catch (error) {
                alert('Ошибка при изменении статуса языка');
                console.error(error);
            }
        }
    };

    const handleCreateLanguage = async () => {
        if (!newLanguage.name || !newLanguage.extension || !newLanguage.monacoLanguage) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (!imageFile && !newLanguage.icon) {
            alert('Пожалуйста, загрузите изображение или укажите эмодзи');
            return;
        }

        setIsSubmitting(true);
        try {
            let iconData = newLanguage.icon;
            
            // If image file is selected, convert to base64
            if (imageFile) {
                const reader = new FileReader();
                iconData = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(imageFile);
                });
            }

            await createLanguage({
                ...newLanguage,
                icon: iconData,
            });

            // Reset form
            setNewLanguage({ name: '', icon: '', extension: '', monacoLanguage: '' });
            setImageFile(null);
            setImagePreview('');
            setShowCreateModal(false);
        } catch (error: any) {
            alert(error.message || 'Ошибка при создании языка');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateLanguage = async () => {
        if (!editingLanguage) return;

        setIsSubmitting(true);
        try {
            let iconData = editingLanguage.icon;
            
            // If image file is selected, convert to base64
            if (imageFile) {
                const reader = new FileReader();
                iconData = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(imageFile);
                });
            }

            await updateLanguage(editingLanguage.id, {
                name: editingLanguage.name,
                icon: iconData,
                extension: editingLanguage.extension,
                monacoLanguage: editingLanguage.monacoLanguage,
            });

            setEditingLanguage(null);
            setImageFile(null);
            setImagePreview('');
        } catch (error: any) {
            alert(error.message || 'Ошибка при обновлении языка');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetModal = () => {
        setNewLanguage({ name: '', icon: '', extension: '', monacoLanguage: '' });
        setEditingLanguage(null);
        setImageFile(null);
        setImagePreview('');
        setShowCreateModal(false);
        onModalClose?.();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Загрузка языков программирования...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400">Ошибка загрузки языков</p>
                    <p className="text-gray-400 text-sm mt-2">Попробуйте обновить страницу</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="space-y-6">
            {/* Header */}
            <div className="animate-item flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Языки программирования</h1>
                    <p className="text-gray-400">Управляйте поддерживаемыми языками программирования</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Добавить язык</span>
                </button>
            </div>

            {/* Stats */}
            <div className="animate-item grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Code className="w-8 h-8 text-blue-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{languages.length}</div>
                            <div className="text-sm text-gray-400">Всего языков</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Settings className="w-8 h-8 text-green-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{languages.filter(l => l.isActive).length}</div>
                            <div className="text-sm text-gray-400">Активных</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-purple-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{languages.reduce((sum, l) => sum + l.tasksCount, 0)}</div>
                            <div className="text-sm text-gray-400">Заданий</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-yellow-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{languages.reduce((sum, l) => sum + l.usersCount, 0)}</div>
                            <div className="text-sm text-gray-400">Пользователей</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="animate-item bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Поиск языков программирования..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
                    />
                </div>
            </div>

            {/* Languages Grid */}
            <div className="animate-item grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLanguages.map((language) => (
                    <div key={language.id} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                {language.icon.startsWith('data:') ? (
                                    <img 
                                        src={language.icon} 
                                        alt={language.name}
                                        className="w-8 h-8 object-contain rounded"
                                    />
                                ) : (
                                    <span className="text-3xl">{language.icon}</span>
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{language.name}</h3>
                                    <p className="text-sm text-gray-400">.{language.extension}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggleActive(language.id)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                    language.isActive 
                                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                                        : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                                }`}
                            >
                                {language.isActive ? 'Активен' : 'Неактивен'}
                            </button>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Monaco ID:</span>
                                <span className="text-white font-mono">{language.monacoLanguage}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Заданий:</span>
                                <span className="text-white">{language.tasksCount}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Пользователей:</span>
                                <span className="text-white">{language.usersCount}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                            <div className="text-xs text-gray-500">
                                Обновлен: {new Date(language.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => {
                                        setEditingLanguage(language);
                                        setImagePreview(language.icon.startsWith('data:') ? language.icon : '');
                                    }}
                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                                    title="Редактировать"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteLanguage(language.id)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                    title="Удалить"
                                    disabled={language.tasksCount > 0}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {filteredLanguages.length === 0 && (
                <div className="animate-item text-center py-12">
                    <Code className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-400 mb-2">Языки не найдены</h3>
                    <p className="text-gray-500">Попробуйте изменить поисковый запрос</p>
                </div>
            )}

            {/* Create Language Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9998]">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Добавить язык программирования</h2>
                            <button
                                onClick={resetModal}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Название *</label>
                                <input
                                    type="text"
                                    value={newLanguage.name}
                                    onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                    placeholder="JavaScript"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Иконка</label>
                                <div className="space-y-3">
                                    {/* Image Upload */}
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpg,image/jpeg,image/svg+xml"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-600/50 transition-colors"
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span>Загрузить изображение (PNG, JPG, SVG)</span>
                                        </button>
                                    </div>
                                    
                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-8 h-8 object-contain rounded"
                                            />
                                            <span className="text-sm text-gray-300">Изображение загружено</span>
                                            <button
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview('');
                                                }}
                                                className="ml-auto text-red-400 hover:text-red-300"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* OR Divider */}
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1 h-px bg-gray-600"></div>
                                        <span className="text-xs text-gray-500">или</span>
                                        <div className="flex-1 h-px bg-gray-600"></div>
                                    </div>
                                    
                                    {/* Emoji Input */}
                                    <input
                                        type="text"
                                        value={newLanguage.icon}
                                        onChange={(e) => setNewLanguage({...newLanguage, icon: e.target.value})}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                        placeholder="🟨 (эмодзи)"
                                        disabled={!!imageFile}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Расширение файла *</label>
                                <input
                                    type="text"
                                    value={newLanguage.extension}
                                    onChange={(e) => setNewLanguage({...newLanguage, extension: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                    placeholder="js"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Monaco Language ID *</label>
                                <input
                                    type="text"
                                    value={newLanguage.monacoLanguage}
                                    onChange={(e) => setNewLanguage({...newLanguage, monacoLanguage: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                    placeholder="javascript"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-6">
                            <button
                                onClick={resetModal}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleCreateLanguage}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Создание...' : 'Создать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Language Modal */}
            {editingLanguage && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9998]">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Редактировать язык</h2>
                            <button
                                onClick={resetModal}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Название *</label>
                                <input
                                    type="text"
                                    value={editingLanguage.name}
                                    onChange={(e) => setEditingLanguage({...editingLanguage, name: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Иконка</label>
                                <div className="space-y-3">
                                    {/* Current Icon Preview */}
                                    {editingLanguage.icon && (
                                        <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                                            {editingLanguage.icon.startsWith('data:') ? (
                                                <img 
                                                    src={editingLanguage.icon} 
                                                    alt="Current" 
                                                    className="w-8 h-8 object-contain rounded"
                                                />
                                            ) : (
                                                <span className="text-2xl">{editingLanguage.icon}</span>
                                            )}
                                            <span className="text-sm text-gray-300">Текущая иконка</span>
                                        </div>
                                    )}
                                    
                                    {/* Image Upload */}
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpg,image/jpeg,image/svg+xml"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-600/50 transition-colors"
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span>Загрузить новое изображение</span>
                                        </button>
                                    </div>
                                    
                                    {/* New Image Preview */}
                                    {imagePreview && (
                                        <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-8 h-8 object-contain rounded"
                                            />
                                            <span className="text-sm text-green-300">Новое изображение</span>
                                            <button
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview('');
                                                }}
                                                className="ml-auto text-red-400 hover:text-red-300"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* OR Divider */}
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1 h-px bg-gray-600"></div>
                                        <span className="text-xs text-gray-500">или</span>
                                        <div className="flex-1 h-px bg-gray-600"></div>
                                    </div>
                                    
                                    {/* Emoji Input */}
                                    <input
                                        type="text"
                                        value={editingLanguage.icon.startsWith('data:') ? '' : editingLanguage.icon}
                                        onChange={(e) => setEditingLanguage({...editingLanguage, icon: e.target.value})}
                                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                        placeholder="🟨 (эмодзи)"
                                        disabled={!!imageFile}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Расширение файла *</label>
                                <input
                                    type="text"
                                    value={editingLanguage.extension}
                                    onChange={(e) => setEditingLanguage({...editingLanguage, extension: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Monaco Language ID *</label>
                                <input
                                    type="text"
                                    value={editingLanguage.monacoLanguage}
                                    onChange={(e) => setEditingLanguage({...editingLanguage, monacoLanguage: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-6">
                            <button
                                onClick={resetModal}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleUpdateLanguage}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}