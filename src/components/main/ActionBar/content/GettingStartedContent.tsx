import React from 'react';

export function GettingStartedContent() {
  const steps = [
    {
      number: 1,
      title: 'Зарегистрируйтесь',
      description: 'Создайте бесплатный аккаунт, чтобы отслеживать свой прогресс',
      icon: '👤'
    },
    {
      number: 2,
      title: 'Выберите задачу',
      description: 'Начните с простых задач и постепенно повышайте сложность',
      icon: '📝'
    },
    {
      number: 3,
      title: 'Решайте и тестируйте',
      description: 'Пишите код в редакторе и проверяйте решение на тестовых данных',
      icon: '⚡'
    },
    {
      number: 4,
      title: 'Получайте обратную связь',
      description: 'Мгновенная проверка решения с детальными результатами тестов',
      icon: '✅'
    },
    {
      number: 5,
      title: 'Растите в рейтинге',
      description: 'Зарабатывайте баллы и поднимайтесь в таблице лидеров',
      icon: '🚀'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Как начать</h3>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Пять простых шагов к началу вашего пути в программировании
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="animate-item bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 flex items-start gap-6 hover:scale-[1.02]"
          >
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-400">{step.number}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{step.icon}</span>
                <h4 className="text-xl font-semibold text-white">{step.title}</h4>
              </div>
              <p className="text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-300">
          Начать сейчас
        </button>
      </div>
    </div>
  );
}
