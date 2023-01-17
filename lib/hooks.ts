import { auth, firestore } from './firebase'
import { useEffect, useState } from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'

export function useUserData(){
  const [user, loading, error] = useAuthState(auth)
  const [username, setusername] = useState(null)


  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe

    if (user) {
      const ref = firestore.collection('user').doc(user.uid)
      unsubscribe = ref.onSnapshot((doc) => {
        setusername(doc.data()?.username)
      });
    } else {
      setusername(null)
    }
    return unsubscribe
    
  }, [user])

  return { user, username}
}