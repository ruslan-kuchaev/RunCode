'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import LightRays from '@/components/shared/LightRays';
import FPSCounter from "@/components/debug/FpsCounter";

// Типы на основе Prisma schema
type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
type TaskStatus = 'STARTED' | 'SOLVED' | 'UNFINISHED';

interface Language {
  id: number;
  name: string;
  icon: string;
}

interface Task {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  difficulty: TaskDifficulty;
  price: number;
  preview?: string;
  languageId: number;
  language: Language;
  userTask?: {
    status: TaskStatus;
    startedAt: Date;
    solvedAt?: Date;
  };
}

// Фейковые данные
const languages: Language[] = [
  { id: 1, name: 'JavaScript', icon: '🟨' },
  { id: 2, name: 'TypeScript', icon: '📘' },
  { id: 3, name: 'Python', icon: '🐍' },
  { id: 4, name: 'Java', icon: '☕' },
  { id: 5, name: 'C++', icon: '⚙️' },
  { id: 6, name: 'React', icon: '⚛️' },
  { id: 7, name: 'Next.js', icon: '▲' },
  { id: 8, name: 'Node.js', icon: '🟢' },
];

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Создание React компонента',
    shortDescription: 'Создайте переиспользуемый компонент кнопки с поддержкой разных состояний',
    fullDescription: 'Реализуйте компонент Button с поддержкой состояний: default, hover, active, disabled. Компонент должен принимать пропсы: variant, size, children, onClick.',
    difficulty: 'EASY',
    price: 100,
    languageId: 6,
    language: languages[5],
    userTask: { status: 'SOLVED', startedAt: new Date('2025-01-10'), solvedAt: new Date('2025-01-11') },
  },
  {
    id: 2,
    title: 'Анимации с GSAP',
    shortDescription: 'Реализуйте плавные анимации для модального окна',
    fullDescription: 'Создайте модальное окно с анимацией появления и исчезновения используя GSAP. Добавьте анимацию backdrop и контента.',
    difficulty: 'MEDIUM',
    price: 250,
    languageId: 2,
    language: languages[1],
    userTask: { status: 'STARTED', startedAt: new Date('2025-01-15') },
  },
  {
    id: 3,
    title: 'Оптимизация загрузки',
    shortDescription: 'Сократите время загрузки страницы с помощью кэширования',
    fullDescription: 'Реализуйте систему кэширования для API запросов. Используйте React Query или SWR для управления кэшем.',
    difficulty: 'HARD',
    price: 500,
    languageId: 7,
    language: languages[6],
  },
  {
    id: 4,
    title: 'Алгоритм сортировки',
    shortDescription: 'Реализуйте алгоритм быстрой сортировки (Quick Sort)',
    fullDescription: 'Напишите функцию quickSort, которая принимает массив чисел и возвращает отсортированный массив. Включите визуализацию процесса сортировки.',
    difficulty: 'MEDIUM',
    price: 300,
    languageId: 1,
    language: languages[0],
    userTask: { status: 'UNFINISHED', startedAt: new Date('2025-01-12') },
  },
  {
    id: 5,
    title: 'Работа с API',
    shortDescription: 'Создайте клиент для работы с REST API',
    fullDescription: 'Реализуйте класс ApiClient с методами для GET, POST, PUT, DELETE запросов. Добавьте обработку ошибок и retry механизм.',
    difficulty: 'MEDIUM',
    price: 350,
    languageId: 2,
    language: languages[1],
  },
  {
    id: 6,
    title: 'Система аутентификации',
    shortDescription: 'Реализуйте полный цикл аутентификации с JWT',
    fullDescription: 'Создайте систему регистрации, входа и выхода. Используйте JWT токены для авторизации. Добавьте защиту роутов.',
    difficulty: 'HARD',
    price: 600,
    languageId: 8,
    language: languages[7],
  },
  {
    id: 7,
    title: 'Hello World',
    shortDescription: 'Выведите "Hello, World!" в консоль',
    fullDescription: 'Создайте простую программу, которая выводит "Hello, World!" в консоль.',
    difficulty: 'EASY',
    price: 50,
    languageId: 3,
    language: languages[2],
    userTask: { status: 'SOLVED', startedAt: new Date('2025-01-05'), solvedAt: new Date('2025-01-05') },
  },
  {
    id: 8,
    title: 'Микросервисная архитектура',
    shortDescription: 'Спроектируйте и реализуйте микросервисную архитектуру',
    fullDescription: 'Создайте систему из 3 микросервисов: Auth Service, User Service, Task Service. Настройте межсервисное взаимодействие через REST API.',
    difficulty: 'EXPERT',
    price: 1000,
    languageId: 4,
    language: languages[3],
  },
  {
    id: 9,
    title: 'Работа с базой данных',
    shortDescription: 'Создайте CRUD операции для работы с базой данных',
    fullDescription: 'Используя Prisma ORM, создайте модели и реализуйте полный набор CRUD операций для управления пользователями.',
    difficulty: 'HARD',
    price: 550,
    languageId: 2,
    language: languages[1],
  },
  {
    id: 10,
    title: 'Валидация форм',
    shortDescription: 'Реализуйте систему валидации для форм',
    fullDescription: 'Создайте компонент Form с валидацией полей. Используйте библиотеку zod для схем валидации. Добавьте отображение ошибок.',
    difficulty: 'MEDIUM',
    price: 280,
    languageId: 6,
    language: languages[5],
  },
  {
    id: 11,
    title: 'Тестирование компонентов',
    shortDescription: 'Напишите unit тесты для React компонентов',
    fullDescription: 'Используя Jest и React Testing Library, напишите тесты для компонента Button. Покройте все состояния и взаимодействия.',
    difficulty: 'MEDIUM',
    price: 320,
    languageId: 6,
    language: languages[5],
  },
  {
    id: 12,
    title: 'Оптимизация производительности',
    shortDescription: 'Оптимизируйте рендеринг большого списка элементов',
    fullDescription: 'Реализуйте виртуализацию списка для отображения 10000+ элементов без лагов. Используйте react-window или react-virtualized.',
    difficulty: 'HARD',
    price: 650,
    languageId: 6,
    language: languages[5],
  },
];

const getDifficultyColor = (difficulty: TaskDifficulty) => {
  switch (difficulty) {
    case 'EASY':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'MEDIUM':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'HARD':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'EXPERT':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getDifficultyLabel = (difficulty: TaskDifficulty) => {
  switch (difficulty) {
    case 'EASY':
      return 'Легко';
    case 'MEDIUM':
      return 'Средне';
    case 'HARD':
      return 'Сложно';
    case 'EXPERT':
      return 'Эксперт';
    default:
      return difficulty;
  }
};

const getStatusColor = (status?: TaskStatus) => {
  switch (status) {
    case 'SOLVED':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'STARTED':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'UNFINISHED':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getStatusLabel = (status?: TaskStatus) => {
  switch (status) {
    case 'SOLVED':
      return '✅ Решено';
    case 'STARTED':
      return '🔄 В процессе';
    case 'UNFINISHED':
      return '❌ Не завершено';
    default:
      return 'Новое';
  }
};

export default function TasksPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<TaskDifficulty | 'ALL'>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const searchIconRef = useRef<HTMLDivElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tasksGridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const filteredTasks = mockTasks.filter((task) => {
    const matchesDifficulty = selectedDifficulty === 'ALL' || task.difficulty === selectedDifficulty;
    const matchesLanguage = selectedLanguage === 'ALL' || task.languageId === selectedLanguage;
    const matchesSearch = 
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.language.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesLanguage && matchesSearch;
  });

  useEffect(() => {
    if (searchRef.current && searchIconRef.current) {
      gsap.fromTo(
        searchRef.current,
        {
          opacity: 0,
          y: -20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.4)',
          delay: 0.2,
        }
      );

      gsap.fromTo(
        searchIconRef.current,
        {
          opacity: 0,
          scale: 0,
          rotation: -180,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
          delay: 0.4,
        }
      );
    }
  }, []);

  useEffect(() => {
    if (clearButtonRef.current) {
      if (searchQuery) {
        gsap.fromTo(
          clearButtonRef.current,
          {
            opacity: 0,
            scale: 0,
            rotation: -90,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'back.out(1.7)',
          }
        );
      } else {
        gsap.to(clearButtonRef.current, {
          opacity: 0,
          scale: 0,
          rotation: 90,
          duration: 0.2,
          ease: 'power2.in',
        });
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    if (titleRef.current && subtitleRef.current) {
      tl.to([titleRef.current, subtitleRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.2,
      });
    }
    if (filtersRef.current) {
      const filterButtons = filtersRef.current.querySelectorAll('button');
      gsap.set(filterButtons, { opacity: 0, scale: 0.95 });
      
      tl.to(filtersRef.current, {
        opacity: 1,
        duration: 0.15,
      }, '-=0.1');
      
      tl.to(filterButtons, {
        opacity: 1,
        scale: 1,
        duration: 0.15,
        stagger: 0.01,
      }, '-=0.1');
    }

    if (statsRef.current) {
      const statCards = statsRef.current.querySelectorAll('div[class*="bg-gradient"]');
      gsap.set(statCards, { opacity: 0, y: 10 });
      
      tl.to(statsRef.current, {
        opacity: 1,
        duration: 0.15,
      }, '-=0.05');
      
      tl.to(statCards, {
        opacity: 1,
        y: 0,
        duration: 0.15,
        stagger: 0.02,
      }, '-=0.1');
    }
  }, []); 

  useEffect(() => {
    if (tasksGridRef.current) {
      const taskCards = Array.from(tasksGridRef.current.children) as HTMLElement[];
      if (taskCards.length > 0) {
        // Скрываем изначально перед анимацией
        gsap.set(taskCards, { opacity: 0, y: 15 });
        
        gsap.to(taskCards, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.015,
          ease: 'power2.out',
        });
      }
    }
  }, [filteredTasks]);

  return (
    <>
    
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -20,
        }}
      >
          <FPSCounter/>
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1}
          lightSpread={3}
          rayLength={2}
          followMouse={false}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays z-10"
        />
      </div>

      <section className="w-full min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-16">
    
          <div className="text-center mb-12">
            <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ opacity: 0 }}>
              Задания
            </h1>
            <p ref={subtitleRef} className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ opacity: 0 }}>
              Выберите задание и начните свой путь в программировании. Решайте задачи разной сложности и зарабатывайте очки.
            </p>
          </div>

     
          <div ref={searchRef} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск заданий по названию, описанию или языку..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
              <div ref={searchIconRef} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <button
                ref={clearButtonRef}
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                style={{ display: searchQuery ? 'block' : 'none' }}
              >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
            </div>
          </div>

       
          <div ref={filtersRef} className="max-w-6xl mx-auto mb-8" style={{ opacity: 0 }}>
            <div className="flex flex-wrap gap-4 justify-center">

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDifficulty('ALL')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedDifficulty === 'ALL'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  Все
                </button>
                {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as TaskDifficulty[]).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                      selectedDifficulty === difficulty
                        ? getDifficultyColor(difficulty) + ' scale-105'
                        : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                    }`}
                  >
                    {getDifficultyLabel(difficulty)}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLanguage('ALL')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedLanguage === 'ALL'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  Все языки
                </button>
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border flex items-center gap-2 ${
                      selectedLanguage === lang.id
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 scale-105'
                        : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600/50'
                    }`}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

  
          <div className="max-w-7xl mx-auto">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-xl">Задания не найдены</p>
              </div>
            ) : (
              <div ref={tasksGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
                    style={{ opacity: 0 }}
                  >
                  
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 flex-1 pr-2">
                        {task.title}
                      </h3>
                      <span
                        className={`${getDifficultyColor(task.difficulty)} text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap`}
                      >
                        {getDifficultyLabel(task.difficulty)}
                      </span>
                    </div>

                 
                    <p className="text-gray-400 mb-4 line-clamp-2 min-h-[3rem]">
                      {task.shortDescription}
                    </p>

                  
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{task.language.icon}</span>
                        <span className="text-gray-300 font-medium">{task.language.name}</span>
                      </div>
                      <div className="text-lg font-bold text-cyan-400">
                        {task.price} <span className="text-sm text-gray-400">очков</span>
                      </div>
                    </div>

         
                    {task.userTask && (
                      <div className="mb-4">
                        <span
                          className={`${getStatusColor(task.userTask.status)} text-xs font-medium px-3 py-1 rounded-full border inline-block`}
                        >
                          {getStatusLabel(task.userTask.status)}
                        </span>
                      </div>
                    )}

         
                    <button className="w-full mt-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 font-semibold py-3 rounded-lg border border-cyan-500/50 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                      {task.userTask?.status === 'STARTED' ? 'Продолжить →' : 'Начать задание'}
                    </button>

            
                    <div className="absolute top-2 right-2 w-8 h-8 bg-cyan-500/10 rounded-full opacity-50 blur-sm pointer-events-none"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-blue-500/10 rounded-full opacity-50 blur-sm pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="max-w-6xl mx-auto mt-16">
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6" style={{ opacity: 0 }}>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">{mockTasks.length}</div>
                <div className="text-sm text-gray-400">Всего заданий</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">
                  {mockTasks.filter((t) => t.userTask?.status === 'SOLVED').length}
                </div>
                <div className="text-sm text-gray-400">Решено</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">
                  {mockTasks.filter((t) => t.userTask?.status === 'STARTED').length}
                </div>
                <div className="text-sm text-gray-400">В процессе</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">
                  {mockTasks.reduce((sum, t) => sum + (t.userTask?.status === 'SOLVED' ? t.price : 0), 0)}
                </div>
                <div className="text-sm text-gray-400">Заработано очков</div>
              </div>
            </div>
          </div>

 
          <footer className="border-t border-gray-800 mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-500">
                <p>&copy; 2025 RunCode. Interactive programming trainer platform.</p>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
