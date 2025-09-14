"use client"
import { useGSAP } from "@gsap/react";
import useAnimationStore from "@/store/AnimationCenter";

export default function NavMenu() {
  const complete = useAnimationStore((state) => state.isHelloComplete);
  const RoureHref = ["Главаня", "Задачи", "Рейтинг"];
  useGSAP(() => {}, { scope: "", dependencies: [complete] });

  return (
    <>
      <div className="fixed top-0 left-[50%] transform -translate-x-1/2 ">
        <nav className="flex flex-nowrap gap-10.5 mt-2 ">
          {RoureHref.map((N, index) => (
            <div key={index}>
              <a className="" href="">
                {N}
                 {/*копонент   */}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}