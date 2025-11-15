import Header from "@/components/layout/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black w-full">
      <Header />
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-10 bg-white dark:bg-black sm:items-start pt-50">
        <div className="flex flex-col md:items-center gap-6 text-center md:flex-row">
          <Image
            src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg"
            width={400}
            height={400}
            alt="Picture of students studying"
            className="rounded-md"
          />
          <div className="flex flex-col items-start gap-2 md:gap-4 justify-center text-left">
            <h1 className="tracking-wide max-w-xs text-3xl font-semibold leading-10 tracking-tight text-gray-800 dark:text-zinc-50">
              Look at all this cool people studying! 🤓
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              It has nothing to do with the website but makes it feel less empty now!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
