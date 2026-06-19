import React from 'react';

const steps = [
    {
        cmd: '$ register',
        title: 'Создай аккаунт',
        description: 'Почта или GitHub — на твой выбор. Занимает 30 секунд.',
    },
    {
        cmd: '$ ls tasks',
        title: 'Выбери задачу',
        description: 'Фильтруй по языку и сложности. Начни с того, что интересно.',
    },
    {
        cmd: '$ run solution.js',
        title: 'Пиши и запускай',
        description: 'Редактор прямо здесь. Запускай сколько угодно раз.',
    },
    {
        cmd: '$ check --tests',
        title: 'Смотри результат',
        description: 'Видишь какие тесты прошли, какие нет. Правишь, запускаешь снова.',
    },
    {
        cmd: '$ git push',
        title: 'Растёшь',
        description: 'Очки, стрики, место в рейтинге. Прогресс не исчезает.',
    },
];

export function GettingStartedContent() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-white mb-1">Как начать</h3>
                <p className="text-gray-500 text-sm">Пять шагов. Первый — прямо сейчас.</p>
            </div>

            <div className="space-y-3 max-w-3xl">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/40 transition-colors duration-300"
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                            {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <span className="font-mono text-xs text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded">
                                    {step.cmd}
                                </span>
                                <span className="text-white font-medium text-sm">{step.title}</span>
                            </div>
                            <p className="text-gray-500 text-sm">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <button className="px-6 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium rounded-lg border border-blue-500/40 hover:border-blue-500/60 transition-all duration-200 text-sm">
                    Начать →
                </button>
            </div>
        </div>
    );
}
