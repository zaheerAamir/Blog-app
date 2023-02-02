import { createContext } from "react"

export const UserContext = createContext({user: null, username: null})

export const CountContext = createContext({count: null, setcount: null})