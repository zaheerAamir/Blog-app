import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../lib/context'
import firebase from 'firebase/compat'
import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import debounce from 'lodash.debounce'


export default function EnterPage() {
    const { user, username } = useContext(UserContext)

    return (
        <main>
           {user ?  
                !username ? <UsernameForm/> : <SignOutButton/>
                : 
                <SignInButton/>
           }
        </main>
    )
}

function SignInButton() {
    
        const SignInWithGoogle = async () => {
            await auth.signInWithPopup(googleAuthProvider)
        }
    
    return(
        <>
            <button className='btn-google' onClick={SignInWithGoogle}>
                <img src={'/icons8-google-80.png'}/>
                Sign in with Google
            </button>
        </>
    )
}

function SignOutButton() {

    return(
        <button onClick={() => auth.signOut()}>SignOut</button>
    )
}

function UsernameForm() {

    const [formValue, setformValue] = useState('')
    const [isValid, setisValid] = useState(false)
    const [loading, setloading] = useState(false)

    const { user, username } = useContext(UserContext)

    const onSubmit = async (e) => {
        e.preventDefault() 
 
        //Create ref for both documents
        const userDoc = firestore.doc(`user/${user.uid}`)
        const usernameDoc = firestore.doc(`username/${formValue}`)
 
        const batch = firestore.batch()
        batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName})
        batch.set(usernameDoc, {uid: user.uid})
 
        await batch.commit()
    }


     const onChange = (e) => {
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

        if(val){
            setformValue(val)
            setloading(false)
            setisValid(false)
        }

        if(re.test(val)){
            setformValue(val)
            setloading(true)
            setisValid(false)
        }
    } 

    useEffect(() => {
        checkUsername(formValue)
    },[formValue])

   

    const checkUsername = useCallback(
        debounce(async (username) => {
            if(username.length >= 3){
                const ref = firestore.doc(`username/${username}`)
                const { exists } = await ref.get()
                console.log('Firestore read executed')
                setisValid(!exists)
                setloading(false)
            }
        }, 500),
        []
    )


   


   


    return(
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name='username' placeholder='username' value={formValue} onChange={onChange}/>

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>

                    <button type='submit' className='btn-green' disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug state</h3>
                    <div>
                        Username: {formValue}
                        <br/>
                        Loading: {isValid.toString()}
                        <br/>
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    )

    function UsernameMessage({username, isValid, loading}){
        if(loading){
            return <p>Checking...</p>
        }
        else if(isValid){
           return <p className='text-success'>{username} is available!</p> 
        }
        else if(username && !isValid){
            return <p className='text-danger'>That username is already taken</p>
        }
        else{
            return <p></p>
        }
    }
}
