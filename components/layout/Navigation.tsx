import { signIn } from "next-auth/react"

function Navigation(){
    return (
        <nav>
            <ul className="md:flex gap-2 hidden md:visible">
                <li>    <button onClick={() => signIn("google")}>Sign in</button></li>
                <li>Decks</li>
                <li>About</li>
            </ul>
        </nav>
    )
}

export default Navigation