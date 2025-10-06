"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import TextType from "../shadcn/TextType";
import useAnimationStore from "@/store/AnimationCenter";

interface HelloRunAnimateProps {
	onComplete?: () => void;
}

export default function HelloRunAnimate({ onComplete }: HelloRunAnimateProps) {
	const overlayRef = useRef<HTMLDivElement | null>(null);
	const complete = useAnimationStore((state) => state.completeHello);

	const handleComplete = () => {
		const overlay = overlayRef.current;
		if (!overlay) return;
		const tl = gsap.timeline();
		tl.to(overlay, { opacity: 0, duration: 0.2, ease: "power2.out" })
			.set(overlay, { display: "none", pointerEvents: "none" })
			.call(() => {
				onComplete?.();
				complete();
			});
	};

	return (
		<div
			ref={overlayRef}
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
		>
			<TextType
				as="h1"
				className="text-white text-4xl sm:text-5xl md:text-6xl font-bold"
				text={["Hello, RunCode!", " "]}
				typingSpeed={135}
				deletingSpeed={80}
				pauseDuration={1000}
				initialDelay={150}
				loop={false}
				showCursor
				cursorCharacter="|"
				textColors={["#ffffff"]}
				onSentenceComplete={handleComplete}
			/>
		</div>
	);
}
