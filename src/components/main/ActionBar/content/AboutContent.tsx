import React from 'react';

export function AboutContent() {
    return (
        <div className="space-y-8">
            <div className="max-w-2xl">
                <h3 className="text-2xl font-bold text-white mb-3">Что такое RunCode?</h3>
                <p className="text-gray-400 leading-relaxed">
                    Это место, где ты пишешь код — не читаешь про него. Никаких слайдов,
                    никаких лекций. Берёшь задачу, решаешь, видишь результат.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500/40 transition-colors duration-300">
                    <div className="text-2xl mb-3">⚡</div>
                    <h4 className="text-white font-semibold mb-1">Без воды</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Задача → редактор → тесты. Всё что нужно, ничего лишнего.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500/40 transition-colors duration-300">
                    <div className="text-2xl mb-3">🔁</div>
                    <h4 className="text-white font-semibold mb-1">Итерации</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Не получилось — попробуй ещё раз. Ошибки здесь не наказывают, они учат.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500/40 transition-colors duration-300">
                    <div className="text-2xl mb-3">📈</div>
                    <h4 className="text-white font-semibold mb-1">Прогресс виден</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Каждая решённая задача — это не просто галочка, а реальный рост.
                    </p>
                </div>
            </div>

            <div className="border-l-2 border-green-500/50 pl-4">
                <p className="text-gray-400 text-sm italic">
                    Сделано разработчиками, которым надоело учиться по туториалам.
                </p>
            </div>
        </div>
    );
}
