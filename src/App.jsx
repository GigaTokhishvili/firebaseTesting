import { useState, useEffect } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { nanoid } from "nanoid";
import Image from "./components/Image";


const auth = getAuth();
const provider = new GoogleAuthProvider();

function App(props) {
  const [pic, setPic] = useState({});
  const [imageList, setImageList] = useState([]);

  const imageListRef = ref(storage, 'images/');

  const [logged, setLogged] = useState(null);
  
  auth.onAuthStateChanged((user) => {
    setLogged(user ? true : false);
  })
  
  
  function uploadImage() {
    if (pic === null) return;
    
    const imagesRef = ref(storage, `images/${pic.name + nanoid()}`);
    uploadBytes(imagesRef, pic).then(() => {
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

      {!logged && <div id='whenSignedOut'>
        <button id='signInBtn' onClick={() => signInWithPopup(auth, provider)}
          >sign in</button>
      </div>}

      {logged && <div id='whenSignedin'>
        <div id='userDetails'>
          <h3>hello giga, your id is: ugabuga</h3>
        </div>
        <button id='signOutBtn' onClick={() => auth.signOut()}
          >sign out</button>

      <div>
        <input type="file" onChange={(e) => {
          setPic(e.target.files[0]);
          console.log(pic);
        }}/>
        <button className='button' onClick={uploadImage}>upload</button>
      </div>

      </div>}


        <div className="pics">
        {images}
        </div>
    </div>

  )
}

export default App;
