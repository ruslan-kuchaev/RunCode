import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useState } from "react";

export const SocialAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={() => handleSocialLogin('github')}
        disabled={loadingProvider === 'github'}
        className="py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaGithub size={20} />
        {loadingProvider === 'github' ? 'Загрузка...' : 'GitHub'}
      </button>
      <button 
        onClick={() => handleSocialLogin('google')}
        disabled={loadingProvider === 'google'}
        className="py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-white hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FcGoogle size={20} />
        {loadingProvider === 'google' ? 'Загрузка...' : 'Google'}
      </button>
    </div>
  );
};
