import Navbar from '@/components/landing/Navbar';
import MagicButton from '@/components/layout/MagicButton';
import Image from 'next/image';

function Star() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="m5.825 22l1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625l7.2.625l-5.45 4.725L18.175 22L12 18.275L5.825 22Z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black w-full">
      <Navbar />
      <main className="flex min-h-screen w-full flex-col items-center  dark:bg-black sm:items-start">
        <div className="flex flex-col md:items-center gap-6 text-center md:flex-row bg-[#fcc52c] p-4 w-full">
          <Image
            src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg"
            width={400}
            height={400}
            alt="Picture of students studying"
            className="rounded-md"
          />
          <div className="flex flex-col items-start gap-4 md:gap-4 justify-center text-left font-mono">
            <h1 className="tracking-tighter max-w-sm text-3xl font-extrabold leading-10 text-gray-900 dark:text-zinc-50">
              Look at all this cool people studying! 🤓
            </h1>
            <MagicButton />
          </div>
        </div>
        <section className="px-6 py-10 font-mono text-sm">
          <ul className="flex flex-row gap-8 flex-wrap justify-center">
            <li className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m12.225 12.5l2.275-1.375l2.275 1.375l-.6-2.6l2-1.725l-2.625-.225L14.5 5.5l-1.05 2.45l-2.625.225l2 1.725zM5.7 21.875q-.825.125-1.487-.387T3.45 20.15L2.125 9.225q-.1-.825.4-1.475T3.85 7L5 6.85V15q0 1.65 1.175 2.825T9 19h9.3q-.15.6-.6 1.038t-1.1.512zM9 17q-.825 0-1.412-.587T7 15V4q0-.825.588-1.412T9 2h11q.825 0 1.413.588T22 4v11q0 .825-.587 1.413T20 17z"
                />
              </svg>
              <span className="flex flex-col">
                <b>1246000</b> Decks created
              </span>
            </li>
            <li className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m10.7 12.725l-.85-1.275q-.125-.2-.35-.325T9.025 11h-6.55Q2.2 10.35 2.1 9.75T2 8.5q0-2.35 1.575-3.925T7.5 3q1.3 0 2.475.55T12 5.1q.85-1 2.025-1.55T16.5 3q2.35 0 3.925 1.575T22 8.5q0 .65-.1 1.25T21.525 11h-5.95L13.85 8.45q-.15-.225-.387-.338T12.95 8q-.325 0-.562.188t-.338.487l-1.35 4.05ZM12 21.35l-1.45-1.3q-2.625-2.35-4.3-4.025T3.625 13h4.8l1.725 2.55q.15.225.388.338t.512.112q.325 0 .563-.188t.337-.487l1.35-4.075l.875 1.3q.125.2.35.325T15 13h5.375q-.95 1.35-2.625 3.025t-4.3 4.025L12 21.35Z"
                />
              </svg>
              <span className="flex flex-col">
                <b>Healthy</b> for your brain
              </span>
            </li>
            <li className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m12.225 12.5l2.275-1.375l2.275 1.375l-.6-2.6l2-1.725l-2.625-.225L14.5 5.5l-1.05 2.45l-2.625.225l2 1.725zM5.7 21.875q-.825.125-1.487-.387T3.45 20.15L2.125 9.225q-.1-.825.4-1.475T3.85 7L5 6.85V15q0 1.65 1.175 2.825T9 19h9.3q-.15.6-.6 1.038t-1.1.512zM9 17q-.825 0-1.412-.587T7 15V4q0-.825.588-1.412T9 2h11q.825 0 1.413.588T22 4v11q0 .825-.587 1.413T20 17z"
                />
              </svg>
              <span className="flex flex-col">
                <div className="flex">
                  <span className="mr-1">4.9</span>
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                </div>{' '}
                on the App Store
              </span>
            </li>
          </ul>
        </section>
        <section className="bg-[#4ea4a1] w-full p-4 font-mono">
          <div className="bg-white border-4 border-black p-6 text-black">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis nulla consequuntur
            ipsam vitae odio beatae modi exercitationem dolor, perspiciatis libero inventore?
            Voluptatem accusamus culpa nihil, laudantium quibusdam quia harum quisquam!
          </div>
        </section>
      </main>
    </div>
  );
}
