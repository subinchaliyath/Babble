import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Posts from "./Posts";
import { db } from "./FirebaseConfig";
import './Home.css'
import Spinner from "./Spinner";

function Home({user}) {
  const [loading,setLoading] = useState(false)
  const [posts, setPosts] = useState([]);
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
  return (
    <div>
      <Header user={user}/>
      {loading?
      <div style={{minHeight:'80vh',display:'flex',justifyContent:'center'}}>
        <Spinner/>
      </div>:
      <div className="home_main">
        {posts.length > 0 &&
          posts.map(({ post, id }) => (
            <div className="home_posts_container" key={id}>
              <Posts
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            </div>
          ))}
        </div>}
    </div>
  );
}

export default Home;
