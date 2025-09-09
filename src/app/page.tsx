import HelloRunAnimate from "@/components/animate/HelloRunAnimate";
import Header from "@/components/main/header/Header";

export default function Home() {
  return (
    <>
      <HelloRunAnimate />
      <Header />
      <main className="w-full">
        {Array.from({ length: 5 }).map((_, idx) => (
          <section
            key={idx}
            id={`section-${idx}`}
            data-index={idx}
            className="min-h-[120vh] flex items-center justify-center border-b border-neutral-200"
          >
            <div className="text-3xl font-semibold">Section {idx + 1}</div>
          </section>
        ))}
      </main>
    </>
  );
}
