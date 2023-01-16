import Link from "next/link";
import { UserContext } from "../lib/context";
import { useContext } from "react";

export default function Auth(props) {
    const {username} = useContext(UserContext)

    return username ? props.children : <Link href='/enter'>You must be Signed in!</Link>
}