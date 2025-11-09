import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Ghost } from "lucide-react";
import useAnimationStore from "@/store/AnimationCenter";

export const Login = () => {
  const loginRef = useRef(null);
  const complete = useAnimationStore((state) => state.isHelloComplete);

  useGSAP(
    () => {
      //TODO
      if (!complete) return;
      let scrolltimeout;
      const lastScrollY = window.scrollY;
      const levelSpeed = {
        [10]: 0.5,
        [50]: 0.7,
        [100]: 0.9,
      };

      gsap.fromTo(
        loginRef.current,
        { opacity: 0, y: -50, scale: 0.5 },
        {
          scale: 1,
          delay: 0.5,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.inOut",
        }
      );
    },
    { dependencies: [complete], scope: loginRef }
  );

  return (
    <div
      ref={loginRef}
      className="fixed top-5 left-[2%] z-55 will-change-auto opacity-0"
    >
      <div className="rounded-full bg-amber-500 w-12 h-12 shadow-md shadow-amber-500/50 flex transform origin-center">
        <Ghost size={35} className="m-auto transform origin-center" />
      </div>
    </div>
  );
};
