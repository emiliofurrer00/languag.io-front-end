"use client";

import { signIn, useSession } from "next-auth/react";

export default function MagicButton(){
    const { data: session } = useSession();
    const isLoggedIn = Boolean(session?.user)

    return (
        <button className={`text-lg font-mono font-semibold ${isLoggedIn ? "text-black bg-white border-4 border-black" : "text-white bg-black"} px-5 py-3 w-full rounded-sm`} onClick={() => signIn('google')} disabled={isLoggedIn}>
            {isLoggedIn ? `🐦 Welcome ${session?.user?.name} 💩` : "I wanna be like them"}
        </button>
    )
}