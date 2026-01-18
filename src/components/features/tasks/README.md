# Tasks Components

Модульные компоненты для страницы заданий (Tasks Page).

## Компоненты

### TasksHeader
Заголовок страницы с поиском заданий.
- Анимированный заголовок и подзаголовок
- Поле поиска с анимацией иконки
- Кнопка очистки поиска

### TasksFilters
Фильтры для заданий.
- Переключатель вида (сетка/список)
- Фильтр по сложности
- Фильтр по языку программирования
- Анимация появления кнопок

### TaskCard
Карточка задания для сеточного вида.
- Информация о задании
- Статус выполнения
- Навигация к решению задачи
- Hover эффекты

### TaskListItem
Элемент списка для списочного вида.
- Компактное отображение информации
- Адаптивная верстка
- Навигация к решению задачи

### TasksGrid
Контейнер для сеточного отображения заданий.
- Анимация появления карточек
- Адаптивная сетка
- Обработка пустого состояния

### TasksList
Контейнер для списочного отображения заданий.
- Анимация появления элементов
- Вертикальный список
- Обработка пустого состояния

### TasksStats
Статистика по заданиям.
- Общее количество заданий
- Количество решенных
- Количество в процессе
- Заработанные очки

## Использование

```tsx
import {
    TasksHeader,
    TasksFilters,
    TasksGrid,
    TasksList,
    TasksStats
} from '@/components/features/tasks';

// В компоненте страницы
<TasksHeader 
    searchQuery={searchQuery}
    onSearchChange={setSearchQuery}
/>

<TasksFilters
    selectedDifficulty={selectedDifficulty}
    onDifficultyChange={setSelectedDifficulty}
    selectedLanguage={selectedLanguage}
    onLanguageChange={setSelectedLanguage}
    menuSelectedLayout={menuSelectedLayout}
    onLayoutChange={setMenuSelectedLayout}
    languages={languages}
/>

{menuSelectedLayout === "grid" ? (
    <TasksGrid tasks={filteredTasks} />
) : (
    <TasksList tasks={filteredTasks} />
)}

<TasksStats tasks={mockTasks} />
```

## Особенности

- **GSAP анимации**: Все компоненты используют GSAP для плавных анимаций
- **TypeScript**: Полная типизация всех пропсов и интерфейсов
- **Адаптивность**: Компоненты адаптируются под разные размеры экрана
- **Модульность**: Каждый компонент независим и переиспользуем
- **Навигация**: Интеграция с Next.js Link для навигации

## Типы данных

```tsx
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
    difficulty: TaskDifficulty;
    price: number;
    language: Language;
    userTask?: {
        status: TaskStatus;
        startedAt: Date;
        solvedAt?: Date;
    };
}
```