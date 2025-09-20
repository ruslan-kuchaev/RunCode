"use client";
// убери
import HelloRunAnimate from "@/components/animate/HelloRunAnimate";
import { FixedMenu } from "@/components/main/header/FixedMenu/FixedMenu";
import LightRays from "@/components/shadcn/LightRays";
import TerminalInterface from "@/components/terminal/Terminalinterface";

export default function Home() {
  return (
    <>
      <HelloRunAnimate />
      <div style={{ width: '100%', height: '1200px', position: 'absolute', }}>

  <LightRays

    raysOrigin="right"

    raysColor="#00ffff"

    raysSpeed={1}

    lightSpread={3}

    rayLength={2}

    followMouse={false}

    mouseInfluence={0.1}

    noiseAmount={0.1}

    distortion={0.05}

    className="custom-rays"

  />

</div>
      <FixedMenu />
        <section id="terminal-section" className="w-full min-h-screen bg-gray-950 ">
        <div className="container mx-auto px-4 py-16">
          {/* Заголовок секции */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Начни с Терминал
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Попробуйте RunCode через наш интерактивный терминал. Войдите в систему, изучите команды и начните свой путь в программировании.
            </p>
          </div>

          {/* Терминал */}
          <div className="max-w-6xl mx-auto">
            <TerminalInterface 
            />
          </div>

          {/* Дополнительная информация */}
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-xl">$</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Command Line Interface</h3>
              <p className="text-gray-400">
                Navigate through RunCode using familiar terminal commands
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">User Authentication</h3>
              <p className="text-gray-400">
                Login or register directly through the terminal interface
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-400 text-xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Experience</h3>
              <p className="text-gray-400">
                Real-time feedback and typewriter effects for immersive coding
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-500">
              <p>&copy; 2025 RunCode. Interactive programming trainer platform.</p>
            </div>
          </div>
        </footer>
      </section>

    </>
  );
}
