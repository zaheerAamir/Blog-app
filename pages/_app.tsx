import '../styles/globals.css'
import Navbar from '../components/navbar'
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'
import { useState } from 'react'
import { CountContext } from '../lib/context'

function MyApp({Component, pageProps}) {

  const userData = useUserData()
  const [count, setcount] = useState(0)

  return (
      <>
        <UserContext.Provider value={userData}>
          <CountContext.Provider value={{count: count, setcount: setcount}}>
            <Navbar/>
            <Component {...pageProps} />
          </CountContext.Provider>
        </UserContext.Provider>
      </>
  )
}

export default MyApp
