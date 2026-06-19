import React from 'react';

const features = [
    {
        tag: 'editor',
        title: 'Редактор прямо в браузере',
        description: 'Подсветка синтаксиса, автодополнение, горячие клавиши. Не нужно ничего устанавливать.',
    },
    {
        tag: 'streaks',
        title: 'Стрики и привычка',
        description: 'Каждый день — новая задача. Пропустил — стрик сгорает. Жёстко, но работает.',
    },
    {
        tag: 'leaderboard',
        title: 'Таблица лидеров',
        description: 'Видишь, где ты среди других. Мотивирует лучше любого курса.',
    },
    {
        tag: 'difficulty',
        title: 'От «Hello World» до алгоритмов',
        description: 'Начни с простого. Дойди до сложного. Уровни подбираются под тебя.',
    },
    {
        tag: 'feedback',
        title: 'Мгновенная проверка',
        description: 'Нажал «Запустить» — сразу видишь, что прошло, что нет и почему.',
    },
    {
        tag: 'points',
        title: 'Очки за решения',
        description: 'Сложнее задача — больше очков. Честная система без накруток.',
    },
];

export function FeaturesContent() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-white mb-1">Что внутри</h3>
                <p className="text-gray-500 text-sm">Без маркетинга — просто список того, что реально есть.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f) => (
                    <div
                        key={f.tag}
                        className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500/40 transition-colors duration-300"
                    >
                        <span className="inline-block text-xs font-mono text-purple-400/70 mb-3 bg-purple-500/10 px-2 py-0.5 rounded">
                            #{f.tag}
                        </span>
                        <h4 className="text-white font-semibold mb-1.5">{f.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
