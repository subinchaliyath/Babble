import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Posts from "./Posts";
import { db } from "./FirebaseConfig";

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    db.collection("posts").onSnapshot((snapShot) => {
      setPosts(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);
  return (
    <div>
      <Header user={user} />
      {posts.length > 0 &&
        posts.map(({ post, id }) => (
          <div key={id}>
            <Posts
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          </div>
        ))}
    </div>
  );
};

export default Home;
