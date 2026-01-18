'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    Code, 
    Calendar,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

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
    testResults?: TestResult[]; // Make testResults optional
    score: number;
}

interface SubmissionHistoryProps {
    submissions: Submission[];
}

export default function SubmissionHistory({ submissions }: SubmissionHistoryProps) {
    const historyRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (historyRef.current && submissions.length > 0) {
            const submissionItems = historyRef.current.querySelectorAll('.submission-item');
            gsap.set(submissionItems, { opacity: 0, y: 20 });
            gsap.to(submissionItems, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out',
            });
        }
    }, { dependencies: [submissions.length] });

    const getStatusIcon = (status: Submission['status']) => {
        switch (status) {
            case 'PASSED':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'FAILED':
                return <XCircle className="w-5 h-5 text-red-400" />;
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-400" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: Submission['status']) => {
        switch (status) {
            case 'PASSED':
                return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'FAILED':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'PENDING':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            default:
                return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
        }
    };

    const getStatusLabel = (status: Submission['status']) => {
        switch (status) {
            case 'PASSED': return 'Принято';
            case 'FAILED': return 'Отклонено';
            case 'PENDING': return 'Проверяется';
            default: return 'Неизвестно';
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Только что';
        if (diffInMinutes < 60) return `${diffInMinutes} мин. назад`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} ч. назад`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} дн. назад`;
    };

    if (submissions.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                    <Code className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">Пока нет попыток</h3>
                    <p className="text-sm text-gray-500">
                        Запустите код, чтобы увидеть результаты здесь
                    </p>
                </div>
            </div>
        );
    }

    const bestSubmission = submissions.find(s => s.status === 'PASSED') || 
                          submissions.reduce((best, current) => 
                              current.score > best.score ? current : best, submissions[0]);

    return (
        <div className="h-full flex flex-col">
            {/* Header with stats */}
            <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">История попыток</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-800/30 rounded-lg p-2">
                        <div className="text-lg font-bold text-white">{submissions.length}</div>
                        <div className="text-xs text-gray-400">Всего</div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-2">
                        <div className="text-lg font-bold text-green-400">
                            {submissions.filter(s => s.status === 'PASSED').length}
                        </div>
                        <div className="text-xs text-gray-400">Принято</div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-2">
                        <div className="text-lg font-bold text-cyan-400">{bestSubmission.score}%</div>
                        <div className="text-xs text-gray-400">Лучший</div>
                    </div>
                </div>
            </div>

            {/* Submissions list */}
            <div ref={historyRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {submissions.map((submission, index) => (
                    <div
                        key={submission.id}
                        className={`submission-item p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                            submission.id === bestSubmission.id 
                                ? 'ring-2 ring-cyan-500/50 bg-cyan-500/5' 
                                : 'hover:bg-gray-800/30'
                        } ${getStatusColor(submission.status)}`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                {getStatusIcon(submission.status)}
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-white">
                                            Попытка #{submissions.length - index}
                                        </span>
                                        {submission.id === bestSubmission.id && (
                                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">
                                                Лучшая
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {getStatusLabel(submission.status)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <div className="text-lg font-bold text-white">
                                    {submission.score}%
                                </div>
                                <div className="text-xs text-gray-400">
                                    {formatTimeAgo(submission.submittedAt)}
                                </div>
                            </div>
                        </div>

                        {/* Test results summary */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-400">
                                        {formatDate(submission.submittedAt)}
                                    </span>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                    <span className="text-gray-400">
                                        {submission.testResults?.filter(r => r.passed).length || 0}/
                                        {submission.testResults?.length || 0} тестов
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-400">
                                    {submission.testResults && submission.testResults.length > 0 ? Math.round(
                                        submission.testResults.reduce((sum, r) => sum + r.executionTime, 0) / 
                                        submission.testResults.length
                                    ) : 0}мс
                                </span>
                            </div>
                        </div>

                        {/* Code preview */}
                        <div className="mt-3 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                            <code className="text-xs text-gray-300 font-mono line-clamp-2">
                                {submission.code.split('\n')[0]}
                                {submission.code.split('\n').length > 1 && '...'}
                            </code>
                        </div>

                        {/* Detailed test results */}
                        {submission.testResults && submission.testResults.some(r => !r.passed) && (
                            <div className="mt-3 space-y-1">
                                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                    Ошибки
                                </div>
                                {submission.testResults
                                    .filter(r => !r.passed)
                                    .slice(0, 2)
                                    .map((result, idx) => (
                                        <div key={idx} className="text-xs text-red-300 bg-red-500/10 p-2 rounded border border-red-500/20">
                                            Тест {idx + 1}: {result.error || 'Неверный результат'}
                                        </div>
                                    ))}
                                {submission.testResults.filter(r => !r.passed).length > 2 && (
                                    <div className="text-xs text-gray-400">
                                        +{submission.testResults.filter(r => !r.passed).length - 2} других ошибок
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}