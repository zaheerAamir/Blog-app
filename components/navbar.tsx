import Link from "next/link"
import { useContext } from "react"
import { UserContext } from "../lib/context"

export default function Navbar() {
    
    const { user, username } = useContext(UserContext)

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href='/'>
                        <button className="btn-logo">Feed</button>
                    </Link>
                </li>


                {username && (
                    <>
                        <li className="push-left">
                            <Link href='/admin'>
                                <button>Write Post</button>
                            </Link>
                        </li>
                        
                        <Link href='/enter'>
                            <button>Sign Out</button>
                        </Link>

                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL}></img>
                            </Link>
                        </li>
                    </>
                )}
                {!username && (
                    <Link href='/enter'>
                        <button className="btn-blue">Login</button>
                    </Link>
                )}

            </ul>
        </nav>
    )
}