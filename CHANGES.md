# Список исправлений RunCode

## ✅ Исправленные проблемы

### 1. **Навигация — ActivedPoint всегда под "Главная"**
**Файл:** `src/components/main/header/FixedMenu/NavMenu/NavMenu.tsx`

**Проблема:** `activeId` не синхронизировался с текущим URL — всегда оставался `"home"`.

**Решение:**
- Добавлен `usePathname()` из `next/navigation`
- Добавлен `useEffect` который обновляет `activeId` при изменении `pathname`
- Теперь `ActivedPoint` корректно отображается под активной страницей

---

### 2. **View Transitions API — добавлена поддержка**
**Файлы:**
- `next.config.ts` (уже был `viewTransition: true`)
- `src/app/page.tsx`
- `src/app/(public)/tasks/page.tsx`
- `src/components/main/header/FixedMenu/NavMenu/NavMenu.tsx`
- `src/app/globals.css`

**Что сделано:**
- Добавил `viewTransitionName: "page-content"` на основные контейнеры страниц
- Добавил `viewTransitionName` на навигационные ссылки для shared element transitions
- Настроил **ультра-плавный crossfade** (800ms) без движения в `globals.css`
- Переделал навигацию на `document.startViewTransition()` + `router.push()` вместо обычных `<a>` тегов
- Теперь переходы между страницами **почти незаметные** — очень медленный fade без рывков

**Технические детали:**
- Старая страница исчезает за 800ms
- Новая страница появляется за 800ms с задержкой 100ms (для плавного наложения)
- Используется `cubic-bezier(0.4, 0, 0.2, 1)` для естественного easing
- Навигационные элементы остаются на месте (без анимации)

**Комментарии в коде:** Все изменения помечены `// ✅ VIEW TRANSITIONS:`

---

### 3. **FpsCounter в продакшне**
**Файлы:**
- `src/app/page.tsx`
- `src/app/(public)/tasks/page.tsx`

**Проблема:** Debug-компонент `<FpsCounter />` отображался на всех страницах.

**Решение:** Удалён из обеих страниц.

---

### 4. **Zustand DevTools в продакшне**
**Файлы:**
- `src/store/authStore.ts`
- `src/store/actionBarStore.ts`
- `src/store/AnimationCenter.ts`

**Проблема:** DevTools были включены без проверки окружения.

**Решение:** Добавлен `enabled: process.env.NODE_ENV !== 'production'` в конфиг devtools.

---

### 5. **Middleware в неправильном месте**
**Файл:** `src/app/middleware.ts` → `src/middleware.ts`

**Проблема:**
- Middleware лежал в `src/app/` — Next.js его не подхватывал
- Редиректил на `/home` которого не существует

**Решение:**
- Перемещён в `src/middleware.ts` (правильное место)
- Исправлен редирект с `/home` на `/`

---

### 6. **Захардкоженный год в футере**
**Файлы:**
- `src/app/page.tsx`
- `src/app/(public)/tasks/page.tsx`

**Проблема:** `© 2025 RunCode` — год захардкожен.

**Решение:** Заменён на `© {new Date().getFullYear()} RunCode`.

---

### 7. **Доступность (a11y) — LoginModal**
**Файл:** `src/components/main/header/FixedMenu/login/LoginModal.tsx`

**Проблема:** Модальное окно не имело правильных ARIA-атрибутов.

**Решение:**
- Добавлен `role="dialog"` на внешний контейнер
- Добавлен `aria-modal="true"`
- Добавлен `aria-labelledby="auth-modal-title"`
- Убраны дублирующие атрибуты с внутреннего div

---

## 📝 Что НЕ исправлено (по запросу)

- API роуты (бэкенд) — будет сделано позже
- Страницы `/profile`, `/rating`, `/tasks/[id]` — не созданы
- OAuth провайдеры (Google/GitHub) — только UI
- Хэширование паролей в `prisma/seed.ts`
- Опечатка `Solutin` → `Solution` в Prisma схеме
- Удаление лишних зависимостей (`drei`, `zukeeper`, `styled-components`, `leva`)

---

## 🎨 View Transitions — как работает

### Базовые переходы страниц
При переходе `/` → `/tasks` → `/rating`:
- Старая страница исчезает с fade-out + slide вверх (250ms)
- Новая страница появляется с fade-in + slide вниз (300ms)

### Навигационные элементы
Каждая ссылка в NavMenu имеет уникальный `viewTransitionName`:
- `nav-item-home`
- `nav-item-tasks`
- `nav-item-rating`

Это позволяет браузеру "запомнить" позицию элемента и плавно анимировать его между страницами.

### Как тестировать
1. Запустить `npm run dev`
2. Открыть в Chrome/Edge/Firefox 130+/Safari 18.2+
3. Кликнуть по навигации — переходы будут плавными
4. В DevTools → Animations можно замедлить анимации для детального просмотра

---

## 🔍 Проверка

Все файлы проверены через `getDiagnostics` — ошибок нет.

Запустить проект:
```bash
npm run dev
```

Открыть http://localhost:3000 и проверить:
- ✅ Навигация — ActivedPoint под правильной страницей
- ✅ Переходы между страницами плавные
- ✅ FpsCounter не отображается
- ✅ Год в футере динамический
