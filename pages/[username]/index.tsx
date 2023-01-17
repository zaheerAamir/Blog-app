
import UserProfile from "../../components/userProfile"
import { firestore } from "../../lib/firebase"
import Post from '../../components/postFeed'
import { posttojson } from "../../lib/firebase"
import { NOTFOUND } from "dns"

export async function getServerSideProps({query}){

    const {username} = query

    
    let user = null
    let post = null

    const usersRef = firestore.collection('user');
    const queryDoc = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await queryDoc.get()).docs[0];

    //IF no user then shortcut to 404 page
    if(!userDoc){
        return {
            notFound: true
        }
    }


    if(userDoc){
        user = userDoc.data()
        const ref = userDoc.ref
                .collection('posts')
                .orderBy('createdAt', 'desc')
                .limit(5)
        post = (await ref.get()).docs.map(posttojson)
    }

    return {
        props: {user, post}
    }
}

export default function UserProfilePage({user, post}) {


    return (
        <main>
           <UserProfile user={user}/>
           <Post admin={false} Post={post}/>
        </main>
    )
}
