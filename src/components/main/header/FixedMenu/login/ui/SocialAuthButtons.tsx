import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const SocialAuthButtons = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
        <FaGithub size={20} />
        GitHub
      </button>
      <button className="py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-white hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2">
        <FcGoogle size={20} />
        Google
      </button>
    </div>
  );
};
