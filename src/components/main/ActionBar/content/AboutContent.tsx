import React from 'react';

export function AboutContent() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">О RunCode</h3>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          RunCode - это интерактивная платформа для обучения программированию через практику. 
          Мы объединяем современные технологии и геймификацию, чтобы сделать процесс обучения 
          увлекательным и эффективным.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="animate-item bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-3">🎯</div>
          <h4 className="text-xl font-semibold text-white mb-2">Наша миссия</h4>
          <p className="text-gray-400">
            Сделать программирование доступным и интересным для каждого через интерактивные задачи
          </p>
        </div>
        
        <div className="animate-item bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-3">💡</div>
          <h4 className="text-xl font-semibold text-white mb-2">Наш подход</h4>
          <p className="text-gray-400">
            Практика через решение реальных задач с мгновенной обратной связью и визуализацией
          </p>
        </div>
        
        <div className="animate-item bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
          <div className="text-4xl mb-3">🚀</div>
          <h4 className="text-xl font-semibold text-white mb-2">Наша цель</h4>
          <p className="text-gray-400">
            Помочь тысячам разработчиков улучшить свои навыки и достичь карьерных целей
          </p>
        </div>
      </div>
    </div>
  );
}
