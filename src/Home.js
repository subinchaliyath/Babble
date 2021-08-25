import { useEffect, useState } from "react";
import "./App.css";
import Posts from "./Posts";
import "./Home.css";
import Spinner from "./Spinner";
import { db } from "./FirebaseConfig";
import firebase from "firebase";

function Home({ user }) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState([]);

  useEffect(() => {
    setLoading(true);
    db.collection("posts")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    async function fetchData() {
      const storageRef = firebase.storage().ref("profile_images");
      let avatars = [];
      storageRef.listAll().then(async function (result) {
        await result.items.map((imageRef, index) => {
          return imageRef.getDownloadURL().then((url) => {
            avatars = [...avatars, url];
            if (index === result.items.length - 1) {
              setAvatar(avatars);
            }
          });
        });
      });
    }
    fetchData();
  }, []);
  return (
    <div>
      {loading ? (
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </div>
      ) : (
        <div className="home_main">
          {posts.length > 0 &&
            posts.map(({ post, id }) => (
              <div className="home_posts_container" key={id}>
                <Posts
                  postId={id}
                  signedUser={user}
                  username={post.username}
                  avatarUrl={
                    post.username &&
                    avatar &&
                    avatar.filter((e) => e.includes(post.username))[0]
                  }
                  caption={post.caption}
                  imageUrl={post.imageUrl}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Home;
