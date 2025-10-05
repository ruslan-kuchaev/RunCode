"use client";
// убери
import HelloRunAnimate from "@/components/animate/HelloRunAnimate";
import ActionBar from "@/components/main/ActionBar/ActionBar";
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


          <ActionBar/>

          {/* Дополнительный контент для тестирования скролла */}
          <div className="mt-20 mb-16">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              Начните программировать уже сегодня
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-white mb-3">Быстрый старт</h4>
                <p className="text-gray-400">Начните программировать за считанные минуты без установки дополнительного ПО</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-white mb-3">Обучение</h4>
                <p className="text-gray-400">Интерактивные уроки и практические задания для всех уровней</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-white mb-3">Сообщество</h4>
                <p className="text-gray-400">Присоединяйтесь к сообществу разработчиков и делитесь опытом</p>
              </div>
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
