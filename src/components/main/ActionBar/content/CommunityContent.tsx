import React from 'react';

export function CommunityContent() {
  const stats = [
    { label: 'Активных пользователей', value: '10,000+', icon: '👥' },
    { label: 'Решенных задач', value: '50,000+', icon: '✅' },
    { label: 'Доступных задач', value: '500+', icon: '📚' },
    { label: 'Языков программирования', value: '10+', icon: '💻' }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: '🐙', url: '#' },
    { name: 'Discord', icon: '💬', url: '#' },
    { name: 'Telegram', icon: '✈️', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Наше сообщество</h3>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Присоединяйтесь к тысячам разработчиков, которые учатся и растут вместе
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="animate-item bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-white text-center mb-6">Присоединяйтесь к нам</h4>
        <div className="flex justify-center gap-4 flex-wrap">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg hover:border-orange-500/50 transition-all duration-300"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-white font-medium">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-gray-300 text-lg">
            💡 <strong className="text-white">Совет:</strong> Присоединяйтесь к нашему Discord-серверу, 
            чтобы общаться с другими разработчиками, задавать вопросы и делиться опытом!
          </p>
        </div>
      </div>
    </div>
  );
}
