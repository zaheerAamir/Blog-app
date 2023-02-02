import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import Loader from "./loader";

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [downloadURL, setDownloadURL] = useState(null)


    //CREATE a Firebase Upload Task: 
    const uploadfile = async (e) => {
        //GET the file
        const file: any = Array.from(e.target.files)[0]
        const extension = file.type.split('/')[1]

        //Makes reference to the storage bucket location
        const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`)
        setUploading(true)

        //Starts the upload
        const Task = await ref.put(file)

        const percent1: any = ((Task.bytesTransferred / Task.totalBytes) * 100).toFixed(0)
        setProgress(percent1)
        
        //Gets the download url of the inserted file:
        const url = await ref.getDownloadURL()
        setDownloadURL(url)
        setUploading(false)

       
    }


    return (
        <div className="box">
            <Loader show={uploading}/>
            {uploading && <h3>{progress}</h3>}



            {!uploading && (
                <>
                    <label className="btn">
                        📷 Upload Img
                        <input type='file'  onChange={uploadfile}  accept='image/x-png,image/gif,image/jpeg'/>
                    </label>
                </>
            )}



            {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    
        </div>
    )
}