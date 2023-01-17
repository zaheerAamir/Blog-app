import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Loader from '../components/loader'
import { useContext, useEffect, useState } from 'react'
import { CountContext } from '../lib/context'
import Post from '../components/postFeed'
import { firestore, posttojson } from '../lib/firebase'
import { fromMillis } from '../lib/firebase'
import { collectionGroup } from 'firebase/firestore'
import MetaTags from '../components/Metatags'

export async function getServerSideProps(context) {
  const LIMIT = 1

  let post = null

  const ref = firestore
      .collectionGroup('posts')
      .orderBy('createdAt', 'desc')
      .limit(LIMIT)
  
  post = (await ref.get()).docs.map(posttojson)

  return {
    props: {post}
  }

}

export default function Home(props) {
  const [posts, setposts] = useState(props.post)
  const [loading, setloading] = useState(false)
  const [postend, setpostend] = useState(false)

 async function getMorePost(){

  const LIMIT = 1

  setloading(true)
  
  const last = posts[posts.length - 1]

  const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt

  const query = firestore
      .collectionGroup('posts')
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT)

  const newpost = (await query.get()).docs.map(doc => doc.data())

  setposts(posts.concat(newpost))

  setloading(false)

  if(newpost.length < LIMIT){
    setpostend(true)
  }

 }

  return (
    <main>
      <MetaTags title='Home page' description='Home page' image='Home Pgae'/>
      <h1>View all posts: </h1>
      <Post admin={false} Post={posts}/>
      
      {!loading && !postend && <button onClick={getMorePost}>load more</button>}

      <Loader show={loading}/>

      {postend && <p>You have reached the end!</p>}
    </main>
  )
}


