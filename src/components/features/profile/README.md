# Profile Feature Components

Компоненты для страницы профиля пользователя платформы RunCode.

## Обзор

Страница профиля представляет собой комплексную систему управления пользовательским аккаунтом с множеством функций:

- **Редактирование профиля** - изменение личной информации и социальных ссылок
- **Статистика и аналитика** - детальная статистика обучения и прогресса
- **Календарь активности** - визуализация ежедневной активности
- **Система достижений** - отображение полученных и заблокированных наград
- **Настройки** - персонализация интерфейса и уведомлений
- **График навыков** - прогресс по различным технологиям
- **Лента активности** - история последних действий

## Компоненты

### ProfileHeader
Заголовок профиля с основной информацией пользователя и возможностью редактирования.

**Пропсы:**
- `user: UserProfile` - данные пользователя
- `isEditing: boolean` - режим редактирования
- `onEdit: () => void` - включить режим редактирования
- `onSave: (updates: Partial<UserProfile>) => void` - сохранить изменения
- `onCancel: () => void` - отменить редактирование

**Функции:**
- Отображение аватара с возможностью изменения
- Редактирование основной информации (имя, био, локация)
- Социальные ссылки (GitHub, LinkedIn, Twitter, веб-сайт)
- Быстрая статистика (рейтинг, задания, серия)
- Анимированное появление элементов

### ProfileTabs
Навигация по разделам профиля.

**Пропсы:**
- `activeTab: 'overview' | 'settings' | 'activity' | 'achievements'` - активная вкладка
- `onTabChange: (tab) => void` - переключение вкладок

**Вкладки:**
- **Обзор** - основная статистика и прогресс
- **Активность** - календарь и история активности
- **Достижения** - полный список наград
- **Настройки** - персональные настройки

### ProfileStats
Детальная статистика пользователя с анимациями при скролле.

**Пропсы:**
- `user: UserProfile` - данные пользователя

**Метрики:**
- Общий рейтинг и решенные задания
- Текущая серия и дни на платформе
- Средние показатели (очки/день, задания/день)
- Уровень и последняя активность

### LearningProgress
Прогресс обучения с графиками и целями.

**Пропсы:**
- `data: LearningData` - данные об обучении

**Функции:**
- Недельная цель с прогресс-баром
- Быстрая статистика (общие часы, задания в месяце)
- Графики прогресса по месяцам (задания и часы)
- Анимированные диаграммы при скролле

### ActivityCalendar
Календарь активности в стиле GitHub с тепловой картой.

**Пропсы:**
- `data: DailyActivity[]` - данные ежедневной активности

**Особенности:**
- Тепловая карта за последние 12 недель
- 5 уровней интенсивности активности
- Статистика: активные дни, общие часы, текущая серия
- Tooltip с деталями при наведении
- Анимация появления ячеек календаря

### AchievementsList
Полный список достижений с группировкой по редкости.

**Пропсы:**
- `badges: Badge[]` - полученные достижения

**Функции:**
- Группировка по редкости (Легендарные, Эпические, Редкие, Обычные)
- Отображение заблокированных достижений
- Прогресс-бар общего прогресса
- Анимации при скролле для каждой карточки
- Детальная информация о каждом достижении

### ProfileSettings
Комплексные настройки профиля и приложения.

**Пропсы:**
- `user: UserProfile` - данные пользователя
- `onUpdateProfile: (updates) => void` - обновление профиля
- `onUpdatePreferences: (preferences) => void` - обновление настроек

**Разделы:**
- **Профиль** - редактирование личной информации
- **Уведомления** - настройка email, push, достижений
- **Приватность** - видимость информации
- **Внешний вид** - тема и язык интерфейса

### RecentActivity
Лента последних действий пользователя.

**Пропсы:**
- `activities: Activity[]` - список активности
- `showAll?: boolean` - показать все или только последние

**Типы активности:**
- Выполнение заданий
- Получение достижений
- Достижение серий
- Повышение уровня

### SkillsChart
График навыков с группировкой по категориям.

**Пропсы:**
- `skills: Skill[]` - навыки пользователя

**Функции:**
- Группировка по категориям (Frontend, Backend, Database, DevOps, Mobile)
- Прогресс-бары с анимацией
- Уровни навыков (1-10)
- Опыт и прогресс до следующего уровня
- Общая статистика навыков

## Анимации и ScrollTrigger

### GSAP ScrollTrigger
Большинство компонентов используют ScrollTrigger для создания плавных анимаций:

- **Появление при скролле**: Элементы появляются при входе в viewport
- **Исчезновение при обратном скролле**: Элементы исчезают при выходе из viewport
- **Stagger эффекты**: Последовательное появление элементов
- **Прогресс-бары**: Анимированное заполнение при появлении
- **Календарь**: Волновая анимация ячеек календаря

### Оптимизация производительности
- Правильные зависимости в `useGSAP`
- Автоматическая очистка ScrollTrigger при размонтировании
- Условные анимации только при наличии данных

## Типы данных

### UserProfile
```typescript
interface UserProfile {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    rating: number;
    level: string;
    totalPoints: number;
    solvedTasks: number;
    streak: number;
    joinedAt: Date;
    lastActive: Date;
    badges: Badge[];
    skills: Skill[];
    preferences: UserPreferences;
}
```

### UserPreferences
```typescript
interface UserPreferences {
    theme: 'dark' | 'light' | 'auto';
    language: 'ru' | 'en';
    notifications: {
        email: boolean;
        push: boolean;
        achievements: boolean;
        reminders: boolean;
    };
    privacy: {
        showEmail: boolean;
        showStats: boolean;
        showActivity: boolean;
    };
}
```

### LearningData
```typescript
interface LearningData {
    totalHours: number;
    weeklyGoal: number;
    currentWeekHours: number;
    dailyActivity: { date: string; hours: number; tasks: number }[];
    monthlyProgress: { month: string; tasks: number; hours: number }[];
}
```

### Skill
```typescript
interface Skill {
    id: number;
    name: string;
    level: number;
    experience: number;
    maxExperience: number;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
}
```

## Использование

```tsx
import { 
    ProfileHeader,
    ProfileTabs,
    ProfileStats,
    LearningProgress,
    ActivityCalendar,
    AchievementsList,
    ProfileSettings,
    RecentActivity,
    SkillsChart
} from '@/components/features/profile';

// В компоненте страницы
<ProfileHeader user={user} /* другие пропсы */ />
<ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

{activeTab === 'overview' && (
    <>
        <ProfileStats user={user} />
        <LearningProgress data={learningData} />
        <ActivityCalendar data={dailyActivity} />
        <SkillsChart skills={user.skills} />
        <RecentActivity activities={recentActivity} />
    </>
)}

{activeTab === 'settings' && (
    <ProfileSettings 
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onUpdatePreferences={handleUpdatePreferences}
    />
)}

{activeTab === 'achievements' && (
    <AchievementsList badges={user.badges} />
)}
```

## Стилизация

Компоненты следуют дизайн-системе проекта:
- Темная тема с градиентными фонами
- Цветовая схема для разных категорий и уровней
- Консистентные отступы и размеры
- Адаптивный дизайн для всех устройств
- Плавные переходы и hover эффекты
- Использование backdrop-blur для современного вида

## Интеграция с навигацией

Страница профиля добавлена в основную навигацию сайта:
- Ссылка "Профиль" в главном меню
- Доступна по адресу `/profile`
- Автоматическое выделение активной ссылки