import React from 'react';

const stats = [
    { value: '10k+', label: 'пользователей' },
    { value: '50k+', label: 'решений отправлено' },
    { value: '500+', label: 'задач в базе' },
    { value: '10',   label: 'языков' },
];

const links = [
    { name: 'GitHub',   icon: '⬡', url: '#', hint: 'исходники и контрибьюты' },
    { name: 'Discord',  icon: '◈', url: '#', hint: 'живое общение' },
    { name: 'Telegram', icon: '▷', url: '#', hint: 'новости и обновления' },
];

export function CommunityContent() {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-1">Сообщество</h3>
                <p className="text-gray-500 text-sm">Люди, которые решают задачи каждый день.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-orange-500/40 transition-colors duration-300"
                    >
                        <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
                        <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Присоединиться</p>
                <div className="flex flex-wrap gap-3">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            className="group flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-orange-500/40 transition-colors duration-300"
                        >
                            <span className="text-orange-400/70 text-lg leading-none">{link.icon}</span>
                            <div>
                                <div className="text-white text-sm font-medium">{link.name}</div>
                                <div className="text-gray-600 text-xs">{link.hint}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
