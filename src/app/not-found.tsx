import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold ">Тут ничего нету</h1>
        <button className="border border-gray-500 px-4 py-2 rounded-md mt-4 hover:bg-gray-700 transition-colors">
          <Link href="/">иди обратно</Link>
        </button>
      </div>
    </>
  );
}
