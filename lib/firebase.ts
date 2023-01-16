import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig =  {
    apiKey: "AIzaSyDpD_2RSL5OGXtg6hJDZHVupVKq515plHI",
    authDomain: "nextfire-97998.firebaseapp.com",
    projectId: "nextfire-97998",
    storageBucket: "nextfire-97998.appspot.com",
    messagingSenderId: "578924541936",
    appId: "1:578924541936:web:35b4fa0d54d7ff7c9a8f35",
    measurementId: "G-3RM17WFMBD"
}


    firebase.initializeApp(firebaseConfig)


export const auth =  firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED
export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const Servertimestamp = firebase.firestore.FieldValue.serverTimestamp
export const increment = firebase.firestore.FieldValue.increment

export function posttojson(doc){
    const data = doc.data()
    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    }
} 