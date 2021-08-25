import React, { useEffect, useState  } from 'react';
import Avatar from '@material-ui/core/Avatar';
import './Profile.css';
import ImageCropper from './ImageCropper'
import Spinner from "./Spinner";
import Posts from "./Posts";
import { db, auth } from "./FirebaseConfig";
import { IconButton, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import PhotoCamera from "@material-ui/icons/PhotoCamera";


export default function Profile({user}) {
  const [showModal,setShowModal]= useState(false);
  const [editUsername,setEditUsername]= useState(false);
  const [loading,setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState()

  useEffect(() => {
    setLoading(true)
    db.collection("posts").orderBy('timeStamp','desc').onSnapshot((snapShot) => {
      setPosts(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
      setLoading(false)
    });
  }, []);

  const saveUsername = () => {
    if(!username){
      return;
    }
    try{
      auth.currentUser.updateProfile({displayName:username});
      
    }
    catch(error){
      alert(error.message)
      setUsername()
    }
    setEditUsername(false)
  }
  return (
    <div>
      {showModal && <ImageCropper user={user} showModal={setShowModal} />}
      <div className="profile_details">
        <div className="profile_avatar">

        <Avatar alt={user&&user.displayName} src={user&&user.photoURL} onClick={()=>setShowModal(true)}/>
        <IconButton onClick={()=>setShowModal(true)}><PhotoCamera/></IconButton>
        </div>
        {editUsername?
        <div>
          <TextField id="standard-basic" label="Username" onChange={(e)=>setUsername(e.target.value)} defaultValue={user&&user.displayName} />
          <IconButton disabled={!username} onClick={saveUsername}><SaveIcon/></IconButton>
        </div>:
        <div className="profile_name">
          <h1 className="text-capitalize">
              {username?username:user?.displayName}
          </h1>
          {/* <IconButton onClick={()=>setEditUsername(true)}><EditIcon/></IconButton> */}
        </div>}
      </div> 
      <hr className="profile_hr"/>
      {loading?<div style={{minHeight:'80vh',display:'flex',justifyContent:'center'}}>
        <Spinner/>
      </div>:
      <>
      {user&&posts.length > 0 &&
          posts.filter(({post,id})=>post.username===user.displayName).map(({ post, id }) => (
            <div className="home_posts_container" key={id}>
              <Posts
                postId = {id}
                signedUser = {user}
                username={post.username}
                avatarUrl={user&&user.photoURL}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            </div>
          ))}  </> } 
    </div>
  );
}
