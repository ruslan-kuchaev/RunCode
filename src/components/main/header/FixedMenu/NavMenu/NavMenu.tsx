import { useGSAP } from "@gsap/react";
import useAnimationStore from "@/store/AnimationCenter";

export default function NavMenu() {
  const complete = useAnimationStore((state) => state.isHelloComplete);
  const RoureHref = ["Главаня", "Задачи", "Рейтинг"];
  useGSAP(() => {}, { scope: "", dependencies: [complete] });

  return (
    <>
      <div className="fixed top-0 left-[50%] ">
        <nav className="flex flex-nowrap gap-2.5">
          {RoureHref.map((N) => (
            <div>
              <a className="" href="">
                ${N}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
