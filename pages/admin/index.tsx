import Auth from "../../components/AuthCheck"

import { Servertimestamp, auth, firestore } from "../../lib/firebase"
import Post from "../../components/postFeed"

import { useContext, useState } from "react"
import { UserContext } from "../../lib/context"

import { useCollection } from "react-firebase-hooks/firestore"
import kebabcase from 'lodash.kebabcase'
import { useRouter } from "next/router"

export default function Page() {


    return (
        <main>
            <Auth>
                <PostList/>
                <CreateNewPost/>
            </Auth>
        </main>
    )
}

function PostList() {
    const ref = firestore.collection('user').doc(auth.currentUser.uid).collection('posts')
    const query: any = ref.orderBy('createdAt')
    const [querysnapshot] = useCollection(query)

    const posts = querysnapshot?.docs.map((doc) => doc.data())

    return (
        <main>
            <h1>Manage your post</h1>
            <Post Post={posts} admin />
        </main>
    )

}

function CreateNewPost() {
    const router = useRouter()
    const {username} = useContext(UserContext)
    const [title, setTitle] = useState('')

    //Ensure slug is URL safe
    const slug = encodeURI(kebabcase(title))

    //Valid lenght
    const isValid = title.length > 3 && title.length < 100

    const createPost = async (e) => {
        e.preventDefault()
        const uid = auth.currentUser.uid
        const ref = firestore.collection('user').doc(uid).collection('posts').doc(slug)

        const data = {
            title,
            slug,
            uid, 
            username,
            createdAt: Servertimestamp(),
            updatedAt: Servertimestamp(),
            content: '# bro world!',
            heartCount: 0
        }

        await ref.set(data)

        alert('Post Created')

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    }

    return(
        <form onSubmit={createPost}>
            <input
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder='My Awesome Title'
            />

            <p>
                <strong>Slug: </strong> {slug}
            </p>

            <button type="submit" disabled={!isValid} className='btn-green'>
                Create New Post
            </button>
        </form>
    )
}