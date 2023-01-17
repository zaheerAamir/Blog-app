import { useRouter } from "next/router"
import styles from "../../styles/Admin.module.css"
import { useState } from "react"
import {useForm} from 'react-hook-form'
import Link from "next/link"
import ImageUploader from '../../components/ImageUpload'

import Auth from "../../components/AuthCheck"

import { auth, firestore } from "../../lib/firebase"
import { useDocumentData } from "react-firebase-hooks/firestore"
import { serverTimestamp } from "firebase/firestore"
import ReactMarkdown from 'react-markdown';


export default function AdminPostEdit() {
    return (
        <Auth>
            <h1>Edit Post</h1>
            <PostManager/>
        </Auth>
    )
}

function PostManager() {
    const [preview, setPreview] = useState(false)
    const router = useRouter()
    const { slug }: any = router.query

    const postref: any = firestore.collection('user').doc(auth.currentUser.uid).collection('posts').doc(slug)
    const [post] = useDocumentData(postref)

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postref={postref} defaultValues={post} preview={preview}/>                    
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>

                </>
            )}
        </main>
    )
}


function PostForm({postref, defaultValues, preview}) {
    const { register, handleSubmit, reset, watch } = useForm({defaultValues, mode: 'onChange'})

    
    const updatePost = async ({content, published}) => {

        await postref.update({
            content,
            published,
            updatedAt: serverTimestamp()
        }) 
        console.log(content, published)

        reset({content, published})

        alert('Post Updated✌️✌️')

    }
    console.log(watch('content'))
    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}


            <div className={preview ? styles.hidden : styles.controls}>

                <ImageUploader/>

                <textarea name="content"  {...register('content')}></textarea>

                <fieldset>
                    <input className={styles.checkbox} name='published' type="checkbox" {...register('published')} />
                    <label>Published</label>
                </fieldset>

                <button type="submit" className="btn-green">
                    Save Changes
                </button>

            </div>
        </form>
    )
}