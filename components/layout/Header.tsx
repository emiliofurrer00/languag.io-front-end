"use client";

import Link from "next/link";
import Navigation from "./Navigation";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Header() {
    const { data: session } = useSession();
    return (
        <div className="w-full p-4 text-center flex flex-col md:block top-0 left-0 right-0 bg-[#fcc52c] border-b-1 border-b-[#ffefc3]">
            <div className="flex justify-between items-center gap-1 text-black">
                <div className="flex items-center gap-1 text-black">

                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M5.7 21.875q-.825.125-1.487-.387T3.45 20.15L2.125 9.225q-.1-.825.4-1.475T3.85 7L5 6.85V15q0 1.65 1.175 2.825T9 19h9.3q-.15.6-.6 1.038t-1.1.512zM9 17q-.825 0-1.412-.587T7 15V4q0-.825.588-1.412T9 2h11q.825 0 1.413.588T22 4v11q0 .825-.587 1.413T20 17zm3.725-4.8l1.775-1.075l1.775 1.075q.15.1.288 0t.087-.275L16.175 9.9l1.55-1.35q.125-.125.087-.263t-.212-.162l-2.05-.175l-.825-1.9q-.05-.15-.225-.15t-.225.15l-.825 1.9l-2.05.175q-.175.025-.212.163t.087.262l1.55 1.35l-.475 2.025q-.05.175.088.275t.287 0"
                        />
                </svg>
                <Link href='/'>
                    <h2 className="text-xl font-bold select-none">Languag.io</h2>
                </Link>
                        </div>
                <Navigation />
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
    <path fill="currentColor" d="M4 18q-.425 0-.713-.288T3 17q0-.425.288-.713T4 16h16q.425 0 .713.288T21 17q0 .425-.288.713T20 18H4Zm0-5q-.425 0-.713-.288T3 12q0-.425.288-.713T4 11h16q.425 0 .713.288T21 12q0 .425-.288.713T20 13H4Zm0-5q-.425 0-.713-.288T3 7q0-.425.288-.713T4 6h16q.425 0 .713.288T21 7q0 .425-.288.713T20 8H4Z"/>
</svg>
            </div>
        </div>
    );
}
