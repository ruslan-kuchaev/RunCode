'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Editor } from '@monaco-editor/react';
import { Loader2, Play, Save, CheckCircle, ArrowLeft, User, MessageSquare } from 'lucide-react';
import LightRays from '@/components/shared/LightRays';
import { Terminal } from '@/components/features/terminal';

type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
type TaskStatus = 'STARTED' | 'SOLVED' | 'UNFINISHED';

interface Task {
    id: number;
    title: string;
    shortDescription: string;
    fullDescription: string;
    difficulty: TaskDifficulty;
    price: number;
    preview?: string;
    startCode: string;
    language: {
        id: number;
        name: string;
        icon: string;
    };
    userTask?: {
        status: TaskStatus;
        code?: string;
        startedAt: string;
        solvedAt?: string;
    };
    comments: Array<{
        id: number;
        content: string;
        createdAt: string;
        user: {
            id: number;
            username: string;
            avatar?: string;
        };
    }>;
}

const difficultyColor: Record<TaskDifficulty, string> = {
    EASY: 'bg-green-500/20 text-green-400 border-green-500/50',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    HARD: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    EXPERT: 'bg-red-500/20 text-red-400 border-red-500/50',
};
const difficultyLabel: Record<TaskDifficulty, string> = {
    EASY: 'Легко', MEDIUM: 'Средне', HARD: 'Сложно', EXPERT: 'Эксперт',
};

const languageMap: Record<string, string> = {
    'JavaScript': 'javascript',
    'TypeScript': 'typescript',
    'Python': 'python',
    'Java': 'java',
    'C++': 'cpp',
};

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const taskId = parseInt(resolvedParams.id);
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/tasks/${taskId}`);
                if (!res.ok) throw new Error('Ошибка загрузки');
                const data: Task = await res.json();
                setTask(data);
                setCode(data.userTask?.code || data.startCode);
            } catch {
                setError('Не удалось загрузить задачу');
            } finally {
                setLoading(false);
            }
        };

        if (!isNaN(taskId)) {
            fetchTask();
        }
    }, [taskId]);

    const handleSave = async () => {
        if (!session) {
            setSubmitMessage({ type: 'error', text: 'Войдите для сохранения' });
            return;
        }

        try {
            setSaving(true);
            const res = await fetch(`/api/tasks/${taskId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, status: 'STARTED' }),
            });

            if (!res.ok) throw new Error('Ошибка сохранения');

            setSubmitMessage({ type: 'success', text: '💾 Код сохранён' });
            setTimeout(() => setSubmitMessage(null), 3000);
        } catch {
            setSubmitMessage({ type: 'error', text: 'Не удалось сохранить' });
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!session) {
            setSubmitMessage({ type: 'error', text: 'Войдите для отправки решения' });
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch(`/api/tasks/${taskId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, status: 'SOLVED' }),
            });

            if (!res.ok) throw new Error('Ошибка отправки');

            setSubmitMessage({ type: 'success', text: `✅ Решение принято! +${task?.price} очков` });
            
            // Reload task to get updated status
            const taskRes = await fetch(`/api/tasks/${taskId}`);
            if (taskRes.ok) {
                const updatedTask: Task = await taskRes.json();
                setTask(updatedTask);
            }
        } catch {
            setSubmitMessage({ type: 'error', text: 'Не удалось отправить решение' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-400 text-xl mb-4">{error || 'Задача не найдена'}</p>
                <button
                    onClick={() => router.push('/tasks')}
                    className="px-6 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                    ← Назад к задачам
                </button>
            </div>
        );
    }

    const monacoLanguage = languageMap[task.language.name] || 'javascript';

    return (
        <>
            <div className="fixed inset-0 z-[-20]">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#00ffff"
                    raysSpeed={1}
                    lightSpread={3}
                    rayLength={2}
                    followMouse={false}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                    className="custom-rays z-10"
                />
            </div>

            <div className="min-h-screen relative z-10">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <button
                            onClick={() => router.push('/tasks')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Назад к задачам</span>
                        </button>

                        {sessionStatus === 'unauthenticated' && (
                            <p className="text-sm text-yellow-400">⚠️ Войдите для сохранения прогресса</p>
                        )}
                    </div>

                    {/* Task info */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {task.preview && <span className="mr-2">{task.preview}</span>}
                                    {task.title}
                                </h1>
                                <p className="text-gray-400">{task.shortDescription}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className={`${difficultyColor[task.difficulty]} text-sm font-semibold px-3 py-1 rounded-full border`}>
                                    {difficultyLabel[task.difficulty]}
                                </span>
                                <span className="bg-gray-700/50 text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-600/50 flex items-center gap-1.5">
                                    {task.language.icon} {task.language.name}
                                </span>
                                <span className="bg-cyan-500/20 text-cyan-400 text-sm font-bold px-3 py-1 rounded-full border border-cyan-500/50">
                                    {task.price} очков
                                </span>
                            </div>
                        </div>

                        {task.userTask?.status === 'SOLVED' && (
                            <div className="bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg px-4 py-2 flex items-center gap-2 mb-4">
                                <CheckCircle size={18} />
                                <span className="font-medium">Задача решена!</span>
                            </div>
                        )}

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-lg font-semibold text-white mb-2">Описание задачи:</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{task.fullDescription}</p>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden mb-6">
                        <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-700/50 flex items-center justify-between">
                            <h2 className="text-white font-semibold">Редактор кода</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !session}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    <Save size={16} />
                                    {saving ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !session || task.userTask?.status === 'SOLVED'}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    <Play size={16} />
                                    {submitting ? 'Отправка...' : 'Отправить решение'}
                                </button>
                            </div>
                        </div>

                        {submitMessage && (
                            <div className={`px-4 py-2 ${submitMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-b ${submitMessage.type === 'success' ? 'border-green-500/50' : 'border-red-500/50'}`}>
                                {submitMessage.text}
                            </div>
                        )}

                        <div className="h-[500px]">
                            <Editor
                                height="100%"
                                language={monacoLanguage}
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    tabSize: 2,
                                }}
                            />
                        </div>
                    </div>

                    {/* Comments section */}
                    {task.comments.length > 0 && (
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <MessageSquare size={20} />
                                Комментарии ({task.comments.length})
                            </h3>
                            <div className="space-y-4">
                                {task.comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                        <div className="flex items-center gap-3 mb-2">
                                            {comment.user.avatar ? (
                                                <img src={comment.user.avatar} alt={comment.user.username} className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                    <User size={16} className="text-cyan-400" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{comment.user.username}</p>
                                                <p className="text-gray-500 text-xs">
                                                    {new Date(comment.createdAt).toLocaleDateString('ru-RU', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-300">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Terminal section */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Терминал</h3>
                        <Terminal />
                    </div>
                </div>
            </div>
        </>
    );
}
