# Requirements Document

## Introduction

Данный документ описывает требования к масштабному рефакторингу и улучшению архитектуры платформы RunCode - интерактивного тренажера для программистов. Проект включает реорганизацию файловой структуры, разделение компонентов на логические модули, улучшение UX/UI, добавление современных анимаций и создание продвинутого интерфейса для решения задач.

## Glossary

- **RunCode Platform**: Веб-платформа для обучения программированию через интерактивные задачи
- **User**: Пользователь платформы (студент, разработчик)
- **Task**: Программная задача с различными уровнями сложности
- **Terminal Component**: Интерактивный терминал для экспериментов с кодом
- **Action Bar**: Панель действий на главной странице для навигации по разделам
- **Modal Window**: Модальное окно для авторизации/регистрации
- **Solution Page**: Страница решения задачи с редактором кода и консолью
- **Profile Page**: Страница профиля пользователя с активностью и статистикой
- **GSAP**: Библиотека анимаций GreenSock Animation Platform
- **Code Editor**: Редактор кода с подсветкой синтаксиса
- **Resizable Panel**: Панель с возможностью изменения размера
- **Activity Heatmap**: Тепловая карта активности пользователя (как в GitHub)

## Requirements

### Requirement 1: Архитектурная реорганизация проекта

**User Story:** Как разработчик, я хочу иметь четкую и логичную структуру проекта, чтобы легко находить и поддерживать код

#### Acceptance Criteria

1. THE System SHALL организовать компоненты в следующую структуру директорий:
   - `src/components/features/` - функциональные компоненты по фичам
   - `src/components/ui/` - переиспользуемые UI компоненты
   - `src/components/layout/` - компоненты макета (Header, Footer, Sidebar)
   - `src/components/shared/` - общие компоненты
   - `src/features/` - бизнес-логика по фичам (auth, tasks, profile, terminal)
   - `src/lib/` - утилиты и хелперы
   - `src/hooks/` - кастомные React хуки
   - `src/store/` - Zustand stores по доменам
   - `src/types/` - TypeScript типы и интерфейсы
   - `src/constants/` - константы приложения

2. THE System SHALL создать отдельные модули для каждой фичи с собственными компонентами, хуками и типами

3. THE System SHALL переместить все существующие файлы в соответствующие директории согласно новой структуре

4. THE System SHALL обновить все импорты в файлах после перемещения

5. THE System SHALL создать index.ts файлы для экспорта компонентов из каждой директории

### Requirement 2: Модульная система авторизации

**User Story:** Как пользователь, я хочу авторизоваться через модальное окно, чтобы не покидать текущую страницу

#### Acceptance Criteria

1. THE System SHALL удалить отдельную страницу авторизации

2. THE System SHALL создать модальный компонент AuthModal с вкладками для входа и регистрации

3. WHEN пользователь нажимает кнопку "Войти" в Header, THE System SHALL открыть модальное окно авторизации

4. THE AuthModal SHALL содержать формы для входа (email/password) и регистрации (username/email/password)

5. THE System SHALL использовать NextAuth для обработки авторизации

6. WHEN пользователь успешно авторизуется, THE System SHALL закрыть модальное окно и обновить состояние пользователя

7. THE System SHALL отображать ошибки валидации в модальном окне

8. THE System SHALL поддерживать закрытие модального окна по клику вне области или по Escape

### Requirement 3: Улучшенная главная страница с Action Bar

**User Story:** Как пользователь, я хочу взаимодействовать с главной страницей через Action Bar, чтобы видеть различный контент

#### Acceptance Criteria

1. THE System SHALL переименовать кнопки Action Bar на: "О нас", "Возможности", "Как начать", "Сообщество"

2. WHEN пользователь нажимает кнопку в Action Bar, THE System SHALL анимировать появление соответствующего контента снизу

3. THE System SHALL использовать GSAP для плавных анимаций появления/скрытия контента

4. THE System SHALL отображать различный контент для каждой кнопки:
   - "О нас" - информация о платформе
   - "Возможности" - список возможностей и фич
   - "Как начать" - пошаговое руководство
   - "Сообщество" - статистика и ссылки на сообщество

5. THE System SHALL подсвечивать активную кнопку в Action Bar

6. THE System SHALL скрывать предыдущий контент при выборе новой кнопки

### Requirement 4: Интерактивный Terminal компонент

**User Story:** Как пользователь-программист, я хочу экспериментировать с кодом в интерактивном терминале, чтобы практиковаться

#### Acceptance Criteria

1. THE Terminal Component SHALL поддерживать выполнение простых JavaScript команд

2. THE Terminal Component SHALL отображать историю команд с возможностью навигации стрелками вверх/вниз

3. THE Terminal Component SHALL поддерживать автодополнение команд по Tab

4. THE Terminal Component SHALL иметь встроенные команды: help, clear, echo, calc, date, whoami

5. THE Terminal Component SHALL отображать приветственное сообщение при загрузке

6. THE Terminal Component SHALL иметь анимацию печати для вывода текста

7. THE Terminal Component SHALL поддерживать цветной вывод для различных типов сообщений

### Requirement 5: Современные GSAP анимации

**User Story:** Как пользователь, я хочу видеть плавные и современные анимации, чтобы интерфейс был приятным

#### Acceptance Criteria

1. THE System SHALL использовать GSAP 3.13+ с современными плагинами (ScrollTrigger, ScrollSmoother)

2. THE System SHALL анимировать появление элементов при скролле страницы

3. THE System SHALL использовать timeline для сложных последовательных анимаций

4. THE System SHALL применять easing функции для естественных движений

5. THE System SHALL оптимизировать анимации для производительности (will-change, transform)

6. THE System SHALL создать переиспользуемые анимационные хуки (useScrollAnimation, useFadeIn, useSlideIn)

### Requirement 6: Улучшенная страница задач

**User Story:** Как пользователь, я хочу видеть красивую и удобную страницу со списком задач, чтобы легко выбирать задачи

#### Acceptance Criteria

1. THE Tasks Page SHALL отображать задачи в виде карточек с информацией: название, сложность, теги, статус решения

2. THE Tasks Page SHALL поддерживать фильтрацию по сложности (Easy, Medium, Hard, Expert)

3. THE Tasks Page SHALL поддерживать фильтрацию по тегам (Arrays, Strings, Math, etc.)

4. THE Tasks Page SHALL поддерживать поиск задач по названию

5. THE Tasks Page SHALL отображать прогресс пользователя (решенные/всего задач)

6. THE Tasks Page SHALL использовать анимации при наведении на карточки

7. THE Tasks Page SHALL иметь пагинацию или бесконечный скролл

8. THE Tasks Page SHALL отображать иконки для статуса задачи (решена, в процессе, не начата)

### Requirement 7: Страница рейтинга пользователей

**User Story:** Как пользователь, я хочу видеть рейтинг других пользователей, чтобы сравнивать свои достижения

#### Acceptance Criteria

1. THE Rating Page SHALL отображать топ-100 пользователей по рейтингу

2. THE Rating Page SHALL показывать для каждого пользователя: позицию, имя, аватар, рейтинг, количество решенных задач

3. THE Rating Page SHALL подсвечивать текущего пользователя в списке

4. THE Rating Page SHALL поддерживать фильтрацию по периоду (неделя, месяц, все время)

5. THE Rating Page SHALL использовать виртуализацию для оптимизации длинных списков

6. THE Rating Page SHALL анимировать изменения позиций в рейтинге

### Requirement 8: Продвинутая страница решения задачи

**User Story:** Как пользователь, я хочу решать задачи в удобном интерфейсе с редактором кода и консолью, чтобы эффективно работать

#### Acceptance Criteria

1. THE Solution Page SHALL быть разделена на 3 панели: описание задачи, редактор кода, консоль вывода

2. THE Solution Page SHALL поддерживать изменение размера панелей по горизонтали и вертикали

3. THE Solution Page SHALL поддерживать перестановку панелей drag-and-drop

4. THE Solution Page SHALL использовать Monaco Editor или CodeMirror для редактора кода

5. THE Code Editor SHALL поддерживать выбор языка программирования (JavaScript, Python, C++, Java)

6. THE Code Editor SHALL иметь подсветку синтаксиса и автодополнение

7. THE Console Panel SHALL отображать результаты выполнения кода и ошибки

8. THE Solution Page SHALL иметь кнопки: "Запустить", "Отправить решение", "Сбросить код"

9. THE Solution Page SHALL сохранять код пользователя локально (localStorage)

10. THE Solution Page SHALL отображать тестовые случаи и их результаты

11. THE Solution Page SHALL иметь навигацию для перехода к другим задачам

### Requirement 9: Страница профиля пользователя

**User Story:** Как пользователь, я хочу видеть свой профиль с активностью и статистикой, чтобы отслеживать прогресс

#### Acceptance Criteria

1. THE Profile Page SHALL отображать аватар пользователя, имя, email, дату регистрации

2. THE Profile Page SHALL показывать статистику: всего решенных задач, рейтинг, streak (дни подряд)

3. THE Profile Page SHALL отображать Activity Heatmap (как в GitHub) с активностью за последний год

4. THE Profile Page SHALL показывать список последних решенных задач

5. THE Profile Page SHALL отображать достижения и бейджи пользователя

6. THE Profile Page SHALL поддерживать редактирование профиля (имя, аватар, bio)

7. THE Profile Page SHALL показывать статистику по языкам программирования

8. THE Profile Page SHALL отображать график прогресса рейтинга

### Requirement 10: Компонентная архитектура

**User Story:** Как разработчик, я хочу иметь переиспользуемые компоненты, чтобы ускорить разработку

#### Acceptance Criteria

1. THE System SHALL создать базовые UI компоненты: Button, Input, Card, Badge, Avatar, Modal, Dropdown, Tabs

2. THE System SHALL использовать shadcn/ui для базовых компонентов

3. THE System SHALL создать составные компоненты: TaskCard, UserCard, StatCard, CodeBlock

4. THE System SHALL использовать TypeScript для типизации всех компонентов

5. THE System SHALL документировать props компонентов с помощью JSDoc

6. THE System SHALL создать Storybook для визуализации компонентов (опционально)

### Requirement 11: Оптимизация производительности

**User Story:** Как пользователь, я хочу, чтобы приложение работало быстро, чтобы комфортно использовать платформу

#### Acceptance Criteria

1. THE System SHALL использовать React.memo для предотвращения лишних рендеров

2. THE System SHALL использовать useMemo и useCallback для оптимизации вычислений

3. THE System SHALL использовать динамические импорты для code splitting

4. THE System SHALL оптимизировать изображения (Next.js Image component)

5. THE System SHALL использовать виртуализацию для длинных списков

6. THE System SHALL минимизировать размер бандла

7. THE System SHALL использовать Server Components где возможно (Next.js 15)

### Requirement 12: Адаптивный дизайн

**User Story:** Как пользователь мобильного устройства, я хочу использовать платформу на телефоне, чтобы учиться везде

#### Acceptance Criteria

1. THE System SHALL адаптировать все страницы для мобильных устройств (320px+)

2. THE System SHALL использовать responsive breakpoints (sm, md, lg, xl, 2xl)

3. THE System SHALL адаптировать Solution Page для мобильных (вертикальное расположение панелей)

4. THE System SHALL использовать touch-friendly элементы управления

5. THE System SHALL оптимизировать анимации для мобильных устройств

6. THE System SHALL тестировать на различных размерах экранов
