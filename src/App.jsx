import React from "react";
import { useState, useEffect } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { nanoid } from "nanoid";
import Image from "./components/Image";


const auth = getAuth();
const provider = new GoogleAuthProvider();

function App(props) {
  const [photo, setPhoto] = useState(null);
  const [imageList, setImageList] = useState([]);

  const imageListRef = ref(storage, 'images/');
  
  
  function uploadImage() {
    if (photo === null) return;
    
    const imagesRef = ref(storage, `images/${photo.name + nanoid()}`);
    uploadBytes(imagesRef, photo).then(() => {
      alert('image uploaded');
    })
  }
 
  useEffect(() => {
    listAll(imageListRef)
      .then((response) => {
        return Promise.all(response.items.map(getDownloadURL));
      })
      .then((urls) => {
        setImageList(urls);
      })
      .catch((error) => {
        console.log("Error fetching image URLs:", error);
      });
  }, []);
  

  const images = imageList.map((url) => (
    <Image 
      url={url}
      key={nanoid()}
    />
  ))

  return (
    <div className="main">

      <div id='whenSignedOut'>
        <button id='signInBtn' onClick={() => signInWithPopup(auth, provider)}>sign in</button>
      </div>

      <div id='whenSignedin' hidden={true}>
        <div id='userDetails'></div>
        <button id='signOutBtn' onClick={() => signOut()}>sign out</button>
      </div>

      <div>
        <input type="file" onChange={(e) => {
          <button onClick={uploadImage}>upload</button>
          setPhoto(e.target.files[0])
        }}/>
      </div>

        <div className="pics">
        {images}
        </div>
    </div>

  )
}

export default App;
