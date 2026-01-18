import { PrismaClient } from '../src/app/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create system settings
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: 'RunCode',
      siteDescription: 'Платформа для изучения программирования',
      siteUrl: 'https://runcode.dev',
      adminEmail: 'admin@runcode.dev',
    }
  });

  // Create languages
  const languages = [
    {
      name: 'JavaScript',
      icon: '🟨',
      extension: 'js',
      monacoLanguage: 'javascript',
    },
    {
      name: 'TypeScript',
      icon: '📘',
      extension: 'ts',
      monacoLanguage: 'typescript',
    },
    {
      name: 'Python',
      icon: '🐍',
      extension: 'py',
      monacoLanguage: 'python',
    },
    {
      name: 'Java',
      icon: '☕',
      extension: 'java',
      monacoLanguage: 'java',
    },
    {
      name: 'C++',
      icon: '⚙️',
      extension: 'cpp',
      monacoLanguage: 'cpp',
    },
    {
      name: 'React',
      icon: '⚛️',
      extension: 'jsx',
      monacoLanguage: 'javascript',
    },
    {
      name: 'Go',
      icon: '🐹',
      extension: 'go',
      monacoLanguage: 'go',
    },
    {
      name: 'Rust',
      icon: '🦀',
      extension: 'rs',
      monacoLanguage: 'rust',
    },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { name: lang.name },
      update: lang,
      create: lang,
    });
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@runcode.dev' },
    update: {},
    create: {
      email: 'admin@runcode.dev',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      totalPoints: 5000,
      rating: 500,
      country: 'Russia',
      bio: 'Администратор платформы RunCode',
    }
  });

  // Create moderator user
  const moderatorPassword = await bcrypt.hash('moderator123', 12);
  const moderator = await prisma.user.upsert({
    where: { email: 'moderator@runcode.dev' },
    update: {},
    create: {
      email: 'moderator@runcode.dev',
      username: 'moderator',
      password: moderatorPassword,
      role: 'MODERATOR',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      totalPoints: 2500,
      rating: 250,
      country: 'Russia',
      bio: 'Модератор платформы RunCode',
    }
  });

  // Create test users
  const testUsers = [
    {
      email: 'john@example.com',
      username: 'john_doe',
      country: 'USA',
      points: 1200,
      rating: 120,
    },
    {
      email: 'jane@example.com',
      username: 'jane_smith',
      country: 'Canada',
      points: 850,
      rating: 85,
    },
    {
      email: 'alex@example.com',
      username: 'alex_dev',
      country: 'Germany',
      points: 2100,
      rating: 210,
    },
    {
      email: 'maria@example.com',
      username: 'maria_code',
      country: 'Spain',
      points: 1750,
      rating: 175,
    },
    {
      email: 'blocked@example.com',
      username: 'blocked_user',
      country: 'France',
      points: 200,
      rating: 20,
      status: 'BLOCKED' as const,
    },
  ];

  const userPassword = await bcrypt.hash('user123', 12);
  
  for (const userData of testUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        username: userData.username,
        password: userPassword,
        role: 'USER',
        status: userData.status || 'ACTIVE',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        totalPoints: userData.points,
        rating: userData.rating,
        country: userData.country,
        lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random last login within 7 days
      }
    });
  }

  // Get created languages for tasks
  const jsLang = await prisma.language.findUnique({ where: { name: 'JavaScript' } });
  const pyLang = await prisma.language.findUnique({ where: { name: 'Python' } });
  const reactLang = await prisma.language.findUnique({ where: { name: 'React' } });
  const javaLang = await prisma.language.findUnique({ where: { name: 'Java' } });

  // Create sample tasks
  const tasks = [
    {
      title: 'Создание React компонента',
      shortDescription: 'Создайте переиспользуемый компонент кнопки с поддержкой различных состояний',
      fullDescription: `Создайте React компонент Button, который поддерживает следующие пропсы:
      - text: строка с текстом кнопки
      - variant: 'primary' | 'secondary' | 'danger'
      - disabled: boolean
      - onClick: функция обработчик клика
      
      Компонент должен применять соответствующие CSS классы в зависимости от variant и disabled состояния.`,
      difficulty: 'EASY' as const,
      price: 100,
      languageId: reactLang?.id || 1,
      startCode: `import React from 'react';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, variant = 'primary', disabled = false, onClick }) => {
  // Ваш код здесь
  return null;
};

export default Button;`,
      solutionCode: `import React from 'react';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, variant = 'primary', disabled = false, onClick }) => {
  const getClassName = () => {
    let className = 'btn';
    className += \` btn-\${variant}\`;
    if (disabled) className += ' btn-disabled';
    return className;
  };

  return (
    <button 
      className={getClassName()} 
      disabled={disabled} 
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;`,
      testCases: JSON.stringify([
        { input: 'Button with primary variant', expected: 'btn btn-primary' },
        { input: 'Button with secondary variant', expected: 'btn btn-secondary' },
        { input: 'Disabled button', expected: 'btn btn-primary btn-disabled' },
      ]),
      tags: JSON.stringify(['React', 'Components', 'Frontend']),
    },
    {
      title: 'Алгоритм быстрой сортировки',
      shortDescription: 'Реализуйте алгоритм быстрой сортировки (QuickSort)',
      fullDescription: `Реализуйте функцию quickSort, которая принимает массив чисел и возвращает отсортированный массив.
      
      Требования:
      - Используйте алгоритм быстрой сортировки
      - Функция должна работать с массивами любой длины
      - Обработайте крайние случаи (пустой массив, массив из одного элемента)`,
      difficulty: 'MEDIUM' as const,
      price: 300,
      languageId: jsLang?.id || 1,
      startCode: `function quickSort(arr) {
  // Ваш код здесь
  return arr;
}

// Примеры использования:
// quickSort([3, 6, 8, 10, 1, 2, 1]) должно вернуть [1, 1, 2, 3, 6, 8, 10]
// quickSort([]) должно вернуть []
// quickSort([5]) должно вернуть [5]`,
      solutionCode: `function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];
  
  for (let element of arr) {
    if (element < pivot) {
      left.push(element);
    } else if (element > pivot) {
      right.push(element);
    } else {
      equal.push(element);
    }
  }
  
  return [...quickSort(left), ...equal, ...quickSort(right)];
}`,
      testCases: JSON.stringify([
        { input: '[3, 6, 8, 10, 1, 2, 1]', expected: '[1, 1, 2, 3, 6, 8, 10]' },
        { input: '[]', expected: '[]' },
        { input: '[5]', expected: '[5]' },
        { input: '[5, 2, 8, 1, 9]', expected: '[1, 2, 5, 8, 9]' },
      ]),
      tags: JSON.stringify(['Algorithms', 'Sorting', 'Recursion']),
    },
    {
      title: 'Поиск в бинарном дереве',
      shortDescription: 'Реализуйте поиск элемента в бинарном дереве поиска',
      fullDescription: `Реализуйте функцию searchBST для поиска значения в бинарном дереве поиска.
      
      Структура узла дерева:
      class TreeNode {
        constructor(val, left = null, right = null) {
          this.val = val;
          this.left = left;
          this.right = right;
        }
      }
      
      Функция должна возвращать узел с искомым значением или null, если значение не найдено.`,
      difficulty: 'HARD' as const,
      price: 500,
      languageId: jsLang?.id || 1,
      startCode: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function searchBST(root, val) {
  // Ваш код здесь
  return null;
}`,
      solutionCode: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function searchBST(root, val) {
  if (!root || root.val === val) {
    return root;
  }
  
  if (val < root.val) {
    return searchBST(root.left, val);
  } else {
    return searchBST(root.right, val);
  }
}`,
      testCases: JSON.stringify([
        { input: 'Tree: [4,2,7,1,3], val: 2', expected: 'Node with value 2' },
        { input: 'Tree: [4,2,7,1,3], val: 5', expected: 'null' },
      ]),
      tags: JSON.stringify(['Data Structures', 'Binary Tree', 'Search']),
    },
    {
      title: 'Микросервисная архитектура',
      shortDescription: 'Спроектируйте простую микросервисную архитектуру',
      fullDescription: `Создайте базовую структуру для микросервисной архитектуры с тремя сервисами:
      1. UserService - управление пользователями
      2. OrderService - управление заказами  
      3. NotificationService - отправка уведомлений
      
      Каждый сервис должен иметь:
      - Базовый класс с методами CRUD
      - Интерфейс для взаимодействия с другими сервисами
      - Обработку ошибок`,
      difficulty: 'EXPERT' as const,
      price: 1000,
      languageId: javaLang?.id || 1,
      startCode: `// Базовый интерфейс для всех сервисов
interface MicroService {
    String getServiceName();
    boolean isHealthy();
}

// Реализуйте UserService
class UserService implements MicroService {
    // Ваш код здесь
}

// Реализуйте OrderService  
class OrderService implements MicroService {
    // Ваш код здесь
}

// Реализуйте NotificationService
class NotificationService implements MicroService {
    // Ваш код здесь
}`,
      testCases: JSON.stringify([
        { input: 'UserService creation', expected: 'Service created successfully' },
        { input: 'Health check', expected: 'All services healthy' },
      ]),
      tags: JSON.stringify(['Architecture', 'Microservices', 'Java', 'Design Patterns']),
    },
    {
      title: 'Анализ данных с Pandas',
      shortDescription: 'Проанализируйте данные о продажах с помощью Pandas',
      fullDescription: `Используя библиотеку Pandas, проанализируйте данные о продажах:
      
      1. Загрузите данные из CSV
      2. Найдите топ-5 продуктов по продажам
      3. Вычислите среднюю выручку по месяцам
      4. Найдите клиентов с наибольшими покупками
      
      Данные содержат колонки: date, product, customer, amount`,
      difficulty: 'MEDIUM' as const,
      price: 400,
      languageId: pyLang?.id || 1,
      startCode: `import pandas as pd
import numpy as np

def analyze_sales_data(csv_file_path):
    # Загрузите данные
    df = pd.read_csv(csv_file_path)
    
    # Ваш код анализа здесь
    
    results = {
        'top_products': [],
        'monthly_revenue': {},
        'top_customers': []
    }
    
    return results`,
      testCases: JSON.stringify([
        { input: 'Sample CSV data', expected: 'Analysis results' },
      ]),
      tags: JSON.stringify(['Python', 'Data Analysis', 'Pandas']),
    },
  ];

  for (const taskData of tasks) {
    const existingTask = await prisma.task.findFirst({
      where: { title: taskData.title }
    });

    if (!existingTask) {
      await prisma.task.create({
        data: taskData,
      });
    }
  }

  // Create some sample submissions
  const createdTasks = await prisma.task.findMany({ take: 3 });
  const createdUsers = await prisma.user.findMany({ 
    where: { role: 'USER' },
    take: 3 
  });

  if (createdTasks.length > 0 && createdUsers.length > 0) {
    for (let i = 0; i < 10; i++) {
      const randomTask = createdTasks[Math.floor(Math.random() * createdTasks.length)];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const statuses = ['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as any;

      await prisma.submission.create({
        data: {
          userId: randomUser.id,
          taskId: randomTask.id,
          code: `// Sample solution code for ${randomTask.title}
console.log('Hello, World!');`,
          status: randomStatus,
          result: JSON.stringify({
            passed: randomStatus === 'ACCEPTED' ? 5 : Math.floor(Math.random() * 3),
            total: 5,
            testResults: []
          }),
          executionTime: Math.floor(Math.random() * 1000) + 100,
          memoryUsage: Math.floor(Math.random() * 1024 * 1024) + 1024 * 512,
          score: randomStatus === 'ACCEPTED' ? 100 : Math.floor(Math.random() * 60),
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        }
      });
    }
  }

  // Create some UserTask records for solved tasks
  if (createdTasks.length > 0 && createdUsers.length > 0) {
    for (let i = 0; i < 5; i++) {
      const randomTask = createdTasks[Math.floor(Math.random() * createdTasks.length)];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];

      try {
        await prisma.userTask.create({
          data: {
            userId: randomUser.id,
            taskId: randomTask.id,
            status: 'SOLVED',
            solvedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            code: randomTask.solutionCode || 'Sample solution',
          }
        });
      } catch (error) {
        // Skip if already exists (unique constraint)
        continue;
      }
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: admin@runcode.dev / admin123');
  console.log('👤 Moderator user: moderator@runcode.dev / moderator123');
  console.log('👤 Test users: john@example.com, jane@example.com, etc. / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });