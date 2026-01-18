'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LightRays from '@/components/shared/LightRays';
import FPSCounter from "@/components/debug/FpsCounter";
import {
    TaskHeader,
    CodeEditor,
    TaskDescription,
    TestResults,
    TaskSidebar,
    SubmissionHistory
} from '@/components/features/task-solver';
import { useApi } from '@/hooks/useApi';

// Типы данных
interface Task {
    id: number;
    title: string;
    shortDescription: string;
    fullDescription: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
    price: number;
    preview?: string;
    languageId: number;
    startCode: string;
    solutionCode?: string;
    testCases?: string;
    hints?: string;
    tags?: string;
    language: Language;
    userTask?: UserTask;
}

interface Language {
    id: number;
    name: string;
    icon: string;
    extension?: string;
    monacoLanguage?: string;
}

interface UserTask {
    id: number;
    userId: number;
    taskId: number;
    status: 'STARTED' | 'SOLVED' | 'UNFINISHED';
    startedAt: Date;
    solvedAt?: Date;
    code?: string;
}

interface TestResult {
    testCaseId: number;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    executionTime: number;
    error?: string;
}

interface Submission {
    id: number;
    code: string;
    submittedAt: Date;
    status: 'PENDING' | 'PASSED' | 'FAILED';
    testResults?: TestResult[];
    score: number;
}

export default function TaskSolvePage() {
    const params = useParams();
    const { data: session } = useSession();
    const taskId = parseInt(params.id as string);
    
    const [task, setTask] = useState<Task | null>(null);
    const [code, setCode] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
    const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [activeTab, setActiveTab] = useState<'description' | 'submissions' | 'hints'>('description');
    const [sidebarWidth, setSidebarWidth] = useState(400);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { request } = useApi();

    // Загрузка задачи
    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const response = await request(`/api/tasks/${taskId}`);
                setTask(response.task);
                setSelectedLanguage(response.task.language);
                
                // Загружаем пользовательскую задачу если пользователь авторизован
                if (session?.user?.id) {
                    try {
                        const userTaskResponse = await request(`/api/users/${session.user.id}/tasks`);
                        const userTask = userTaskResponse.userTasks?.find((ut: UserTask) => ut.taskId === taskId);
                        if (userTask) {
                            setTask(prev => prev ? { ...prev, userTask } : null);
                            setCode(userTask.code || response.task.startCode);
                        } else {
                            setCode(response.task.startCode);
                        }
                    } catch (error) {
                        // Если пользовательская задача не найдена, используем стартовый код
                        setCode(response.task.startCode);
                    }
                } else {
                    setCode(response.task.startCode);
                }
            } catch (error) {
                console.error('Error fetching task:', error);
                setError('Ошибка загрузки задачи');
            } finally {
                setLoading(false);
            }
        };

        const fetchLanguages = async () => {
            try {
                const response = await request('/api/languages');
                setAvailableLanguages(response.languages);
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };

        if (taskId) {
            fetchTask();
            fetchLanguages();
        }
    }, [taskId, session?.user?.id, request]);

    // Загрузка истории отправок
    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!session?.user?.id || !taskId) return;
            
            try {
                const response = await request(`/api/submissions?userId=${session.user.id}&taskId=${taskId}`);
                setSubmissions(response.submissions || []);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        };

        fetchSubmissions();
    }, [session?.user?.id, taskId, request]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        // Автосохранение кода
        if (task && session?.user?.id) {
            // TODO: Реализовать автосохранение кода в базе данных
            // Можно добавить debounce для оптимизации
        }
    };

    const handleLanguageChange = (language: Language) => {
        setSelectedLanguage(language);
        // TODO: Получить стартовый код для выбранного языка из API
    };

    const handleRunCode = async () => {
        if (!task || !code.trim()) return;

        setIsRunning(true);
        
        try {
            // TODO: Реализовать реальное выполнение кода через API
            // Пока используем симуляцию
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Моковые результаты тестов (заменить на реальные)
            const mockResults: TestResult[] = [
                {
                    testCaseId: 1,
                    passed: Math.random() > 0.3,
                    actualOutput: 'Test output 1',
                    expectedOutput: 'Expected output 1',
                    executionTime: Math.random() * 100,
                    error: Math.random() > 0.8 ? 'Runtime Error: Example error' : undefined
                }
            ];
            
            setTestResults(mockResults);
            
        } catch (error) {
            console.error('Error running code:', error);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!task || !code.trim() || !session?.user?.id) return;

        try {
            // Создаем отправку через API
            const submissionData = {
                userId: session.user.id,
                taskId: task.id,
                code: code,
                languageId: selectedLanguage?.id || task.languageId
            };

            const response = await request('/api/submissions', {
                method: 'POST',
                body: submissionData
            });

            // Обновляем список отправок
            setSubmissions(prev => [response.submission, ...prev]);
            
            // Запускаем тесты
            await handleRunCode();
            
        } catch (error) {
            console.error('Error submitting code:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Загрузка задачи...</p>
                </div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-4">Ошибка загрузки</h1>
                    <p className="text-gray-400">{error || 'Задача не найдена'}</p>
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
                    raysOrigin="top-left"
                    raysColor="#00ffff"
                    raysSpeed={0.8}
                    lightSpread={1.5}
                    rayLength={1.2}
                    followMouse={false}
                    mouseInfluence={0.05}
                    noiseAmount={0.1}
                    distortion={0.02}
                    className="custom-rays z-10"
                />
            </div>

            <div className="min-h-screen bg-gray-900 relative z-10">
                <TaskHeader 
                    task={task}
                    selectedLanguage={selectedLanguage}
                    availableLanguages={availableLanguages}
                    onLanguageChange={handleLanguageChange}
                    onRunCode={handleRunCode}
                    onSubmit={handleSubmit}
                    isRunning={isRunning}
                />

                <div className="flex h-[calc(100vh-80px)]">
                    {/* Sidebar */}
                    <TaskSidebar
                        task={task}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        width={sidebarWidth}
                        onWidthChange={setSidebarWidth}
                    >
                        {activeTab === 'description' && (
                            <TaskDescription task={task} />
                        )}
                        {activeTab === 'submissions' && (
                            <SubmissionHistory submissions={submissions} />
                        )}
                        {activeTab === 'hints' && (
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white mb-4">💡 Подсказки</h3>
                                <div className="space-y-3">
                                    {task.hints ? (
                                        task.hints.split('\n').filter(hint => hint.trim()).map((hint, index) => (
                                            <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                <p className="text-yellow-300 text-sm">{hint.trim()}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Подсказки для этой задачи отсутствуют</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </TaskSidebar>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col">
                        {/* Code Editor */}
                        <div className="flex-1">
                            <CodeEditor
                                code={code}
                                language={selectedLanguage}
                                onChange={handleCodeChange}
                                theme="vs-dark"
                            />
                        </div>

                        {/* Test Results */}
                        <div className="h-64 border-t border-gray-700">
                            <TestResults
                                testResults={testResults}
                                testCases={task.testCases ? JSON.parse(task.testCases) : []}
                                isRunning={isRunning}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}