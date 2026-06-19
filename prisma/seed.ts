import { PrismaClient, TaskDifficulty, TaskStatus, Role } from '../src/app/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Очистка базы
  await prisma.solutin.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.userTask.deleteMany()
  await prisma.task.deleteMany()
  await prisma.language.deleteMany()
  await prisma.user.deleteMany()

  // Создание языков программирования
  const languages = await Promise.all([
    prisma.language.create({
      data: {
        name: 'JavaScript',
        icon: '🟨'
      }
    }),
    prisma.language.create({
      data: {
        name: 'Python',
        icon: '🐍'
      }
    }),
    prisma.language.create({
      data: {
        name: 'TypeScript',
        icon: '🔷'
      }
    }),
    prisma.language.create({
      data: {
        name: 'Java',
        icon: '☕'
      }
    }),
    prisma.language.create({
      data: {
        name: 'C++',
        icon: '⚙️'
      }
    })
  ])

  console.log('✅ Создано языков:', languages.length)

  // Создание пользователей
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@runcode.com',
        username: 'admin',
        password: hashedPassword,
        role: Role.ADMIN,
        rating: 5000,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      }
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'john_coder',
        password: hashedPassword,
        role: Role.USER,
        rating: 1250,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
      }
    }),
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        username: 'alice_dev',
        password: hashedPassword,
        role: Role.USER,
        rating: 2100,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
      }
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        username: 'bob_ninja',
        password: hashedPassword,
        role: Role.USER,
        rating: 850,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
      }
    })
  ])

  console.log('✅ Создано пользователей:', users.length)

  // Создание задач
  const tasks = await Promise.all([
    // JavaScript задачи
    prisma.task.create({
      data: {
        title: 'Сумма двух чисел',
        shortDescription: 'Напишите функцию, которая возвращает сумму двух чисел',
        fullDescription: 'Создайте функцию sum(a, b), которая принимает два числа и возвращает их сумму. Функция должна корректно работать с целыми и дробными числами.',
        difficulty: TaskDifficulty.EASY,
        price: 50,
        preview: '🔢',
        languageId: languages[0].id, // JavaScript
        startCode: 'function sum(a, b) {\n  // Ваш код здесь\n}'
      }
    }),
    prisma.task.create({
      data: {
        title: 'Палиндром',
        shortDescription: 'Проверьте, является ли строка палиндромом',
        fullDescription: 'Напишите функцию isPalindrome(str), которая проверяет, является ли строка палиндромом (читается одинаково слева направо и справа налево). Игнорируйте пробелы и регистр.',
        difficulty: TaskDifficulty.MEDIUM,
        price: 100,
        preview: '🔄',
        languageId: languages[0].id,
        startCode: 'function isPalindrome(str) {\n  // Ваш код здесь\n}'
      }
    }),
    prisma.task.create({
      data: {
        title: 'Дебаунс функция',
        shortDescription: 'Реализуйте debounce функцию',
        fullDescription: 'Создайте функцию debounce(func, delay), которая откладывает выполнение функции func на delay миллисекунд после последнего вызова.',
        difficulty: TaskDifficulty.HARD,
        price: 200,
        preview: '⏱️',
        languageId: languages[0].id,
        startCode: 'function debounce(func, delay) {\n  // Ваш код здесь\n}'
      }
    }),

    // Python задачи
    prisma.task.create({
      data: {
        title: 'Факториал числа',
        shortDescription: 'Вычислите факториал числа',
        fullDescription: 'Напишите функцию factorial(n), которая вычисляет факториал числа n. Используйте рекурсию или итерацию.',
        difficulty: TaskDifficulty.EASY,
        price: 50,
        preview: '📐',
        languageId: languages[1].id, // Python
        startCode: 'def factorial(n):\n    # Ваш код здесь\n    pass'
      }
    }),
    prisma.task.create({
      data: {
        title: 'Числа Фибоначчи',
        shortDescription: 'Найдите N-ое число Фибоначчи',
        fullDescription: 'Реализуйте функцию fibonacci(n), которая возвращает n-ое число последовательности Фибоначчи. Оптимизируйте решение для больших значений n.',
        difficulty: TaskDifficulty.MEDIUM,
        price: 150,
        preview: '🌀',
        languageId: languages[1].id,
        startCode: 'def fibonacci(n):\n    # Ваш код здесь\n    pass'
      }
    }),

    // TypeScript задачи
    prisma.task.create({
      data: {
        title: 'Generic функция фильтрации',
        shortDescription: 'Создайте типизированную функцию фильтрации массива',
        fullDescription: 'Напишите generic функцию filterArray<T>(arr: T[], predicate: (item: T) => boolean), которая фильтрует массив по условию с полной типизацией.',
        difficulty: TaskDifficulty.MEDIUM,
        price: 120,
        preview: '🔍',
        languageId: languages[2].id, // TypeScript
        startCode: 'function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {\n  // Ваш код здесь\n}'
      }
    }),

    // Java задача
    prisma.task.create({
      data: {
        title: 'Сортировка пузырьком',
        shortDescription: 'Реализуйте алгоритм сортировки пузырьком',
        fullDescription: 'Создайте метод bubbleSort(int[] arr), который сортирует массив целых чисел методом пузырька.',
        difficulty: TaskDifficulty.EASY,
        price: 80,
        preview: '🫧',
        languageId: languages[3].id, // Java
        startCode: 'public static void bubbleSort(int[] arr) {\n    // Ваш код здесь\n}'
      }
    }),

    // C++ задача
    prisma.task.create({
      data: {
        title: 'Бинарный поиск',
        shortDescription: 'Реализуйте бинарный поиск в отсортированном массиве',
        fullDescription: 'Напишите функцию binarySearch(vector<int>& arr, int target), которая находит индекс элемента target в отсортированном массиве. Верните -1, если элемент не найден.',
        difficulty: TaskDifficulty.HARD,
        price: 180,
        preview: '🎯',
        languageId: languages[4].id, // C++
        startCode: '#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int>& arr, int target) {\n    // Ваш код здесь\n}'
      }
    }),

    // Expert задача
    prisma.task.create({
      data: {
        title: 'LRU Cache',
        shortDescription: 'Реализуйте LRU кэш',
        fullDescription: 'Создайте класс LRUCache с методами get(key) и put(key, value). Кэш должен удалять наименее используемые элементы при достижении лимита. Сложность операций O(1).',
        difficulty: TaskDifficulty.EXPERT,
        price: 300,
        preview: '💾',
        languageId: languages[0].id,
        startCode: 'class LRUCache {\n  constructor(capacity) {\n    // Ваш код здесь\n  }\n\n  get(key) {\n    // Ваш код здесь\n  }\n\n  put(key, value) {\n    // Ваш код здесь\n  }\n}'
      }
    })
  ])

  console.log('✅ Создано задач:', tasks.length)

  // Создание решений пользователей
  const userTasks = await Promise.all([
    prisma.userTask.create({
      data: {
        userId: users[1].id, // john
        taskId: tasks[0].id,
        status: TaskStatus.SOLVED,
        solvedAt: new Date(),
        code: 'function sum(a, b) {\n  return a + b;\n}'
      }
    }),
    prisma.userTask.create({
      data: {
        userId: users[1].id,
        taskId: tasks[1].id,
        status: TaskStatus.STARTED,
        code: 'function isPalindrome(str) {\n  // В процессе...\n}'
      }
    }),
    prisma.userTask.create({
      data: {
        userId: users[2].id, // alice
        taskId: tasks[0].id,
        status: TaskStatus.SOLVED,
        solvedAt: new Date(),
        code: 'function sum(a, b) {\n  return a + b;\n}'
      }
    }),
    prisma.userTask.create({
      data: {
        userId: users[2].id,
        taskId: tasks[3].id,
        status: TaskStatus.SOLVED,
        solvedAt: new Date(),
        code: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)'
      }
    }),
    prisma.userTask.create({
      data: {
        userId: users[3].id, // bob
        taskId: tasks[0].id,
        status: TaskStatus.UNFINISHED
      }
    })
  ])

  console.log('✅ Создано решений:', userTasks.length)

  // Создание эталонных решений
  const solutions = await Promise.all([
    prisma.solutin.create({
      data: {
        taskId: tasks[0].id,
        solutinCode: 'function sum(a, b) {\n  return a + b;\n}'
      }
    }),
    prisma.solutin.create({
      data: {
        taskId: tasks[1].id,
        solutinCode: 'function isPalindrome(str) {\n  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return cleaned === cleaned.split("").reverse().join("");\n}'
      }
    }),
    prisma.solutin.create({
      data: {
        taskId: tasks[3].id,
        solutinCode: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)'
      }
    })
  ])

  console.log('✅ Создано эталонных решений:', solutions.length)

  // Создание комментариев
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Отличная задача для начинающих! Решил за 2 минуты 🚀',
        userId: users[1].id,
        taskId: tasks[0].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Не забудьте обработать edge cases с пустыми строками',
        userId: users[2].id,
        taskId: tasks[1].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Можно ли использовать мемоизацию для оптимизации?',
        userId: users[3].id,
        taskId: tasks[4].id
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Отличная задача на понимание замыканий!',
        userId: users[2].id,
        taskId: tasks[2].id
      }
    })
  ])

  console.log('✅ Создано комментариев:', comments.length)

  console.log('\n🎉 База данных успешно заполнена!')
  console.log('\n📊 Статистика:')
  console.log(`   Пользователей: ${users.length}`)
  console.log(`   Языков: ${languages.length}`)
  console.log(`   Задач: ${tasks.length}`)
  console.log(`   Решений: ${userTasks.length}`)
  console.log(`   Эталонных решений: ${solutions.length}`)
  console.log(`   Комментариев: ${comments.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
