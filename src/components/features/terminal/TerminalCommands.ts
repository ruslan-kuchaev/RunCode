import { ReactNode } from "react";
import { useActionBarStore, ActionBarSection } from "@/store/actionBarStore";

export interface TerminalCommand {
  name: string;
  description: string;
  usage?: string;
  execute: (args: string[]) => Promise<string | ReactNode>;
}

const availableSectionsPage: Exclude<ActionBarSection, null>[] = [
  "about",
  "features",
  "getting-started",
  "community",
];

export const builtInCommands: Record<string, TerminalCommand> = {
  cd: {
    name: "cd",
    description: "перейти на страницу",
    execute: async (args) => {
      const targetPage = args[0];
      const listPage = availableSectionsPage
        .map((page) => ` - ${page.toLowerCase()}`)
        .join("\n");

      if (args.length === 0) {
        return `нужно написать куда перейти: \n${listPage}`;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!availableSectionsPage.includes(targetPage as any)) {
        return `нет такой страницы напиши одну из этих\n${listPage}`;
      }

      const { setActiveSection, addOpenedSection } =
        useActionBarStore.getState();
      setActiveSection(targetPage as ActionBarSection);
      addOpenedSection(targetPage as ActionBarSection);

      return `создать страницу ${targetPage}`;
    },
  },

  help: {
    name: "help",
    description: "Show available commands",
    execute: async () => {
      const commandList = Object.values(builtInCommands)
        .map((cmd) => `  ${cmd.name.padEnd(12)} - ${cmd.description}`)
        .join("\n");

      return `Available commands:\n\n${commandList}\n\nType 'command --help' for more information about a specific command.`;
    },
  },

  clear: {
    name: "clear",
    description: "Clear terminal screen",
    execute: async () => {
      return "__CLEAR__"; // Special flag to clear terminal
    },
  },

  echo: {
    name: "echo",
    description: "Print text to terminal",
    usage: "echo <text>",
    execute: async (args) => {
      return args.join(" ") || "";
    },
  },

  calc: {
    name: "calc",
    description: "Calculate mathematical expression",
    usage: "calc <expression>",
    execute: async (args) => {
      if (args.length === 0) {
        return "Usage: calc <expression>\nExample: calc 2 + 2";
      }

      try {
        const expression = args.join(" ");
        // Safe evaluation - only allow numbers and basic operators
        const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "");

        if (sanitized !== expression) {
          return "Error: Invalid characters in expression. Only numbers and +, -, *, /, (, ) are allowed.";
        }

        // Using eval for calculator - sanitized input only
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const result = Function(`"use strict"; return (${sanitized})`)();
        return `${expression} = ${result}`;
      } catch (error) {
        return `Error: Invalid expression - ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
  },

  date: {
    name: "date",
    description: "Show current date and time",
    execute: async () => {
      const now = new Date();
      return now.toLocaleString("ru-RU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },

  whoami: {
    name: "whoami",
    description: "Show current user information",
    execute: async () => {
      // This would typically get user from auth context
      return "guest@runcode.dev\nStatus: Not authenticated\n\nUse the login button in the header to sign in.";
    },
  },

  tasks: {
    name: "tasks",
    description: "Navigate to tasks page",
    execute: async () => {
      if (typeof window !== "undefined") {
        window.location.href = "/tasks";
      }
      return "Navigating to tasks page...";
    },
  },

  solve: {
    name: "solve",
    description: "Open task solution page",
    usage: "solve <taskId>",
    execute: async (args) => {
      if (args.length === 0) {
        return "Usage: solve <taskId>\nExample: solve 1";
      }

      const taskId = args[0];
      if (typeof window !== "undefined") {
        window.location.href = `/tasks/${taskId}`;
      }
      return `Opening task ${taskId}...`;
    },
  },

  profile: {
    name: "profile",
    description: "Navigate to profile page",
    execute: async () => {
      if (typeof window !== "undefined") {
        window.location.href = "/profile";
      }
      return "Navigating to profile page...";
    },
  },

  rating: {
    name: "rating",
    description: "Navigate to rating page",
    execute: async () => {
      if (typeof window !== "undefined") {
        window.location.href = "/rating";
      }
      return "Navigating to rating page...";
    },
  },

  code: {
    name: "code",
    description: "Execute JavaScript code snippet",
    usage: "code <javascript code>",
    execute: async (args) => {
      if (args.length === 0) {
        return 'Usage: code <javascript code>\nExample: code console.log("Hello, World!");';
      }

      try {
        const code = args.join(" ");
        // Create a safe execution context
        const result = Function(`"use strict"; return (${code})`)();
        return `Result: ${JSON.stringify(result, null, 2)}`;
      } catch (error) {
        return `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
  },

  fib: {
    name: "fib",
    description: "Calculate Fibonacci number",
    usage: "fib <n>",
    execute: async (args) => {
      if (args.length === 0) {
        return "Usage: fib <n>\nExample: fib 10";
      }

      const n = parseInt(args[0]);
      if (isNaN(n) || n < 0) {
        return "Error: Please provide a valid non-negative integer";
      }

      const fib = (num: number): number => {
        if (num <= 1) return num;
        return fib(num - 1) + fib(num - 2);
      };

      const result = fib(n);
      return `Fibonacci(${n}) = ${result}`;
    },
  },

  prime: {
    name: "prime",
    description: "Check if number is prime or find primes",
    usage: "prime <n> or prime list <n>",
    execute: async (args) => {
      if (args.length === 0) {
        return "Usage: prime <n> or prime list <n>\nExample: prime 17 or prime list 20";
      }

      const isPrime = (num: number): boolean => {
        if (num < 2) return false;
        for (let i = 2; i * i <= num; i++) {
          if (num % i === 0) return false;
        }
        return true;
      };

      if (args[0] === "list") {
        const limit = parseInt(args[1]) || 20;
        const primes: number[] = [];
        for (let i = 2; i <= limit; i++) {
          if (isPrime(i)) primes.push(i);
        }
        return `Primes up to ${limit}:\n${primes.join(", ")}`;
      } else {
        const n = parseInt(args[0]);
        if (isNaN(n)) {
          return "Error: Please provide a valid number";
        }
        return `${n} is ${isPrime(n) ? "prime" : "not prime"}`;
      }
    },
  },

  sort: {
    name: "sort",
    description: "Sort array of numbers",
    usage: "sort <numbers>",
    execute: async (args) => {
      if (args.length === 0) {
        return "Usage: sort <numbers>\nExample: sort 5 2 8 1 9";
      }

      try {
        const numbers = args
          .map((arg) => parseFloat(arg))
          .filter((n) => !isNaN(n));
        if (numbers.length === 0) {
          return "Error: No valid numbers provided";
        }
        const sorted = [...numbers].sort((a, b) => a - b);
        return `Original: [${numbers.join(", ")}]\nSorted: [${sorted.join(
          ", "
        )}]`;
      } catch (error) {
        return `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
  },

  reverse: {
    name: "reverse",
    description: "Reverse a string",
    usage: "reverse <text>",
    execute: async (args) => {
      if (args.length === 0) {
        return "Usage: reverse <text>\nExample: reverse Hello World";
      }

      const text = args.join(" ");
      return `Original: ${text}\nReversed: ${text
        .split("")
        .reverse()
        .join("")}`;
    },
  },

  palindrome: {
    name: "palindrome",
    description: "Check if string is palindrome",
    usage: "palindrome <text>",
    execute: async (args) => {
      if (args.length === 0) {
        return "Usage: palindrome <text>\nExample: palindrome racecar";
      }

      const text = args.join(" ").toLowerCase().replace(/\s/g, "");
      const reversed = text.split("").reverse().join("");
      const isPalindrome = text === reversed;

      return `"${args.join(" ")}" is ${
        isPalindrome ? "a palindrome" : "not a palindrome"
      }`;
    },
  },

  factorial: {
    name: "factorial",
    description: "Calculate factorial",
    usage: "factorial <n>",
    execute: async (args) => {
      if (args.length === 0) {
        return "Usage: factorial <n>\nExample: factorial 5";
      }

      const n = parseInt(args[0]);
      if (isNaN(n) || n < 0) {
        return "Error: Please provide a valid non-negative integer";
      }

      const fact = (num: number): number => {
        if (num <= 1) return 1;
        return num * fact(num - 1);
      };

      const result = fact(n);
      return `${n}! = ${result}`;
    },
  },

  gcd: {
    name: "gcd",
    description: "Calculate greatest common divisor",
    usage: "gcd <a> <b>",
    execute: async (args) => {
      if (args.length < 2) {
        return "Usage: gcd <a> <b>\nExample: gcd 48 18";
      }

      const a = parseInt(args[0]);
      const b = parseInt(args[1]);

      if (isNaN(a) || isNaN(b)) {
        return "Error: Please provide valid integers";
      }

      const gcd = (x: number, y: number): number => {
        return y === 0 ? x : gcd(y, x % y);
      };

      const result = gcd(Math.abs(a), Math.abs(b));
      return `GCD(${a}, ${b}) = ${result}`;
    },
  },

  lcm: {
    name: "lcm",
    description: "Calculate least common multiple",
    usage: "lcm <a> <b>",
    execute: async (args) => {
      if (args.length < 2) {
        return "Usage: lcm <a> <b>\nExample: lcm 12 18";
      }

      const a = parseInt(args[0]);
      const b = parseInt(args[1]);

      if (isNaN(a) || isNaN(b)) {
        return "Error: Please provide valid integers";
      }

      const gcd = (x: number, y: number): number => {
        return y === 0 ? x : gcd(y, x % y);
      };

      const result = Math.abs(a * b) / gcd(a, b);
      return `LCM(${a}, ${b}) = ${result}`;
    },
  },

  random: {
    name: "random",
    description: "Generate random number",
    usage: "random [min] [max]",
    execute: async (args) => {
      if (args.length === 0) {
        return `Random number: ${Math.random()}`;
      } else if (args.length === 1) {
        const max = parseInt(args[0]);
        if (isNaN(max)) {
          return "Error: Please provide a valid number";
        }
        return `Random number (0-${max}): ${Math.floor(
          Math.random() * (max + 1)
        )}`;
      } else {
        const min = parseInt(args[0]);
        const max = parseInt(args[1]);
        if (isNaN(min) || isNaN(max)) {
          return "Error: Please provide valid numbers";
        }
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        return `Random number (${min}-${max}): ${result}`;
      }
    },
  },
};

// Command registry for custom commands
class CommandRegistry {
  private customCommands: Map<string, TerminalCommand> = new Map();

  register(command: TerminalCommand): void {
    this.customCommands.set(command.name, command);
  }

  unregister(commandName: string): void {
    this.customCommands.delete(commandName);
  }

  getCommand(commandName: string): TerminalCommand | undefined {
    return builtInCommands[commandName] || this.customCommands.get(commandName);
  }

  getAllCommands(): TerminalCommand[] {
    return [
      ...Object.values(builtInCommands),
      ...Array.from(this.customCommands.values()),
    ];
  }

  getCommandNames(): string[] {
    return this.getAllCommands().map((cmd) => cmd.name);
  }
}

export const commandRegistry = new CommandRegistry();

// Parse command string into command name and arguments
export function parseCommand(input: string): {
  command: string;
  args: string[];
} {
  const parts = input.trim().split(/\s+/);
  const command = parts[0] || "";
  const args = parts.slice(1);

  return { command, args };
}

// Execute a command
export async function executeTerminalCommand(input: string): Promise<{
  output: string | ReactNode;
  type: "success" | "error" | "info";
}> {
  const { command, args } = parseCommand(input);

  if (!command) {
    return { output: "", type: "info" };
  }

  const cmd = commandRegistry.getCommand(command);

  if (!cmd) {
    return {
      output: `Command not found: ${command}\nType 'help' to see available commands.`,
      type: "error",
    };
  }

  try {
    const output = await cmd.execute(args);
    return { output, type: "success" };
  } catch (error) {
    return {
      output: `Error executing command: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      type: "error",
    };
  }
}
