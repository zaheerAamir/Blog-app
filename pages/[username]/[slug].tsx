import { useDocumentData } from "react-firebase-hooks/firestore";
import Auth from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import PostContent from "../../components/PostContent";
import { firestore } from "../../lib/firebase"
import { posttojson } from "../../lib/firebase"

import styles from '../../styles/Post.module.css';

export async function getStaticPaths(){
    
    const postref = await firestore.collectionGroup('posts').get()
    const paths = postref.docs.map((doc) => {
        const {slug, username} = doc.data()
        return {
            params: {username, slug}
        }
    })

    return  {
        paths,
        fallback: 'blocking',
    }
}

export async function getStaticProps({params}){
    const {username, slug} = params
    const usersRef = firestore.collection('user')
    const queryDoc = usersRef.where('username', '==', username)
    const userDoc = (await queryDoc.get()).docs[0]
    let post
    let path

    if(userDoc){
        const postref = userDoc.ref.collection('posts').doc(slug)
        post = posttojson(await postref.get())

        path = postref.path
    }

    return {
        props: {username, slug, path},
        revalidate: 5000
    }
}



export default function PostPage(props) {

    const postref: any = firestore.doc(props.path) 
    const [realtimePost] = useDocumentData(postref)
    const post = realtimePost || props.post

    return (
        <main className={styles.container}>

            <section>
                <PostContent post={post}/>
            </section>

            <aside className="card">
                <p>
                    <strong>{post?.heartCount || 0} 💓</strong>
                </p>
                <Auth>
                    <HeartButton postref={postref}/>
                </Auth>
            </aside>


        </main>
    )
}