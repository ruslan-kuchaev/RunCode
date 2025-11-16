"use client";

import LightRays from "@/components/shared/LightRays";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (
    e?: React.FormEvent | React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();
  };

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <LightRays
          raysColor="#00ffff"
          raysSpeed={0.5}
          lightSpread={2}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.15}
          distortion={0.08}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-black/10 backdrop-blur-sm border-2 border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-5">
            <h1 className="text-4xl font-bold text-white">Войти</h1>
            <div className="flex items-center justify-center gap-2 mb-4"></div>
            <p className="text-gray-400">Добро пожаловать в RunCode</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Забыли пароль?
              </Link>
            </div>

            <Button
              text="Войти"
              onClick={handleSubmit}
              className="bg-cyan-600 border-cyan-500 mb-6"
            />
          </form>

          <div className="text-center">
            <p className="text-gray-400">
              Нет аккаунта?{" "}
              <Link
                href="/register"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
