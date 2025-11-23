'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { registerSchema, type RegisterFormData } from '@/features/auth/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Ошибка при регистрации');
        return;
      }

      onSuccess?.();
    } catch (err) {
      setError('Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Имя пользователя
        </label>
        <Input
          id="username"
          type="text"
          placeholder="username"
          {...register('username')}
          error={errors.username?.message}
        />
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input
          id="register-email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium mb-1">
          Пароль
        </label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Подтвердите пароль
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}
