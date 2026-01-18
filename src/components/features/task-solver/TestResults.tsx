'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    AlertCircle, 
    Play,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';

interface TestCase {
    id: number;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    description?: string;
}

interface TestResult {
    testCaseId: number;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    executionTime: number;
    error?: string;
}

interface TestResultsProps {
    testResults: TestResult[];
    testCases: TestCase[];
    isRunning: boolean;
}

export default function TestResults({ testResults, testCases, isRunning }: TestResultsProps) {
    const resultsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (resultsRef.current && testResults.length > 0) {
            const resultItems = resultsRef.current.querySelectorAll('.test-result-item');
            gsap.set(resultItems, { opacity: 0, x: -20 });
            gsap.to(resultItems, {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out',
            });
        }
    }, { dependencies: [testResults.length] });

    const getTestCase = (testCaseId: number) => {
        return testCases.find(tc => tc.id === testCaseId);
    };

    const passedTests = testResults.filter(r => r.passed).length;
    const totalTests = testResults.length;
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    if (isRunning) {
        return (
            <div className="h-full bg-gray-900 border-t border-gray-700">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                        <span className="text-white font-medium">Выполнение тестов...</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                        <p className="text-gray-400">Запуск кода и проверка тестов</p>
                    </div>
                </div>
            </div>
        );
    }

    if (testResults.length === 0) {
        return (
            <div className="h-full bg-gray-900 border-t border-gray-700">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
                    <div className="flex items-center space-x-2">
                        <Play className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">Результаты тестов</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <Play className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Запустите код, чтобы увидеть результаты тестов</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-900 border-t border-gray-700 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        {successRate === 100 ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : successRate > 0 ? (
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="text-white font-medium">Результаты тестов</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                        <span className={`font-medium ${
                            successRate === 100 ? 'text-green-400' : 
                            successRate > 0 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                            {passedTests}/{totalTests} пройдено ({successRate}%)
                        </span>
                        
                        <span className="text-gray-400">
                            Среднее время: {Math.round(testResults.reduce((sum, r) => sum + r.executionTime, 0) / testResults.length)}мс
                        </span>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div ref={resultsRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {testResults.map((result, index) => {
                    const testCase = getTestCase(result.testCaseId);
                    if (!testCase) return null;

                    return (
                        <div
                            key={result.testCaseId}
                            className={`test-result-item p-4 rounded-lg border transition-all duration-200 ${
                                result.passed
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-red-500/10 border-red-500/30'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    {result.passed ? (
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    )}
                                    
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-white font-medium">
                                                Тест {index + 1}
                                            </span>
                                            {testCase.isHidden && (
                                                <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                    <EyeOff className="w-3 h-3" />
                                                    <span>Скрытый</span>
                                                </div>
                                            )}
                                        </div>
                                        {testCase.description && (
                                            <p className="text-sm text-gray-400 mt-1">
                                                {testCase.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3 text-sm text-gray-400">
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{result.executionTime.toFixed(1)}мс</span>
                                    </div>
                                </div>
                            </div>

                            {/* Test details */}
                            <div className="space-y-3">
                                {!testCase.isHidden && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                            Входные данные
                                        </label>
                                        <div className="mt-1 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                                            <code className="text-sm text-gray-300 font-mono">
                                                {testCase.input}
                                            </code>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                            Ожидаемый результат
                                        </label>
                                        <div className="mt-1 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                                            <code className="text-sm text-green-300 font-mono">
                                                {testCase.isHidden ? '***' : result.expectedOutput}
                                            </code>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                            Фактический результат
                                        </label>
                                        <div className="mt-1 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                                            <code className={`text-sm font-mono ${
                                                result.passed ? 'text-green-300' : 'text-red-300'
                                            }`}>
                                                {testCase.isHidden ? '***' : result.actualOutput}
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                {result.error && (
                                    <div>
                                        <label className="text-xs font-medium text-red-400 uppercase tracking-wide">
                                            Ошибка
                                        </label>
                                        <div className="mt-1 p-2 bg-red-500/10 rounded border border-red-500/30">
                                            <code className="text-sm text-red-300 font-mono">
                                                {result.error}
                                            </code>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            {testResults.length > 0 && (
                <div className="px-4 py-3 bg-gray-800/30 border-t border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">
                                Общий результат:
                            </span>
                            <span className={`text-sm font-medium ${
                                successRate === 100 ? 'text-green-400' : 
                                successRate > 0 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {successRate === 100 ? '✅ Все тесты пройдены' :
                                 successRate > 0 ? `⚠️ ${passedTests} из ${totalTests} тестов пройдено` :
                                 '❌ Тесты не пройдены'}
                            </span>
                        </div>
                        
                        {successRate === 100 && (
                            <div className="text-sm text-green-400 font-medium">
                                🎉 Готово к отправке!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}