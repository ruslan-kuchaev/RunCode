import React from 'react';

export function FeaturesContent() {
  const features = [
    {
      icon: '💻',
      title: 'Интерактивный редактор кода',
      description: 'Пишите и тестируйте код прямо в браузере с подсветкой синтаксиса'
    },
    {
      icon: '🎮',
      title: 'Геймификация',
      description: 'Зарабатывайте баллы, достижения и поднимайтесь в рейтинге'
    },
    {
      icon: '📊',
      title: 'Отслеживание прогресса',
      description: 'Визуализация вашей активности и статистики решенных задач'
    },
    {
      icon: '🔥',
      title: 'Система стриков',
      description: 'Поддерживайте ежедневную практику и развивайте привычку кодить'
    },
    {
      icon: '🏆',
      title: 'Рейтинговая система',
      description: 'Соревнуйтесь с другими программистами и отслеживайте свой рост'
    },
    {
      icon: '🎯',
      title: 'Разные уровни сложности',
      description: 'От простых задач для новичков до экспертных алгоритмических задач'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Возможности платформы</h3>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Все инструменты, необходимые для эффективного обучения программированию
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="animate-item bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
