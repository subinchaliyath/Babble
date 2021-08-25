import React, { useState, useEffect } from "react";
import "./Posts.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./FirebaseConfig";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FavouriteIcon from "@material-ui/icons/Favorite";
import FavouriteBorderIcon from "@material-ui/icons/FavoriteBorderOutlined";

function Posts({ signedUser, username, imageUrl, caption, postId, avatarUrl }) {
  let history = useHistory();
  const [likeData, setLikeData] = useState({
    noOflikes: 0,
    id: "",
    username: "",
  });
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapsot) => {
          setComments(
            snapsot.docs.map((doc) => ({
              id: doc.id,
              comment: doc.data(),
            }))
          );
        });
    }
    return () => unsubscribe();
  }, [postId]);
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .onSnapshot((snapsot) => {
          let likesArray = snapsot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
          }));
          let isLikedByUser =
            signedUser &&
            likesArray.length > 0 &&
            likesArray.find((item) => {
              return item.username === signedUser.displayName;
            });
          isLikedByUser
            ? setLikeData({
                ...likeData,
                ...isLikedByUser,
                noOflikes: likesArray?.length,
              })
            : setLikeData({ ...likeData, noOflikes: likesArray?.length });
        });
    }
    return () => unsubscribe();
  }, [postId]);

  const postComment = (e) => {
    if (signedUser) {
      e.preventDefault();
      db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: signedUser.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setComment("");
    } else {
      alert("Please login...");
      history.push("/login");
    }
  };
  const handleLike = () => {
    db.collection("posts").doc(postId).collection("likes").add({
      username: signedUser.displayName,
    });
  };
  const handleUnlike = () => {
    db.collection("posts")
      .doc(postId)
      .collection("likes")
      .doc(likeData.id)
      .delete();
  };
  const deletePost = () => {
    var r = window.confirm("Are you sure? Do you want to delete this post?");
    if (r === true) {
      db.collection("posts").doc(postId).delete();
    } else {
      handleClose();
    }
  };
  const deleteComment = (id) => {
    var r = window.confirm("Are you sure? Do you want to delete this comment?");
    if (r === true) {
      db.collection("posts")
        .doc(postId)
        .collection("comments")
        .doc(id)
        .delete();
    }
  };
  return (
    <div className="post_main">
      <div className="post_header">
        <Avatar alt={username} src={avatarUrl} />
        <h3 className="text-capitalize">{username}</h3>
        {username === signedUser?.displayName && (
          <IconButton aria-label="delete" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        )}
      </div>
      <div className="post_image">
        <img src={imageUrl} alt="post-img" />
      </div>
      <div className="post_actions">
        {likeData.id ? (
          <div className="post_likeSection">
            <IconButton onClick={handleUnlike}>
              <FavouriteIcon />
            </IconButton>{" "}
            <p>{likeData.noOflikes === 0 ? "" : likeData.noOflikes}</p>
          </div>
        ) : (
          <div className="post_likeSection">
            <IconButton onClick={handleLike}>
              <FavouriteBorderIcon />
            </IconButton>{" "}
            <p>{likeData.noOflikes === 0 ? "" : likeData.noOflikes}</p>
          </div>
        )}
      </div>
      <h4 className="post_caption">
        <strong className="text-capitalize">{username}</strong>
        {"  "}
        {caption}
      </h4>
      <div className="post_comments">
        {comments.map(({ id, comment }) => (
          <div key={id} className="post_comment">
            <p>
              <strong className="text-capitalize">{comment.username}</strong>
              {"  "}
              {comment.text}
            </p>
            {comment.username === signedUser?.displayName && (
              <IconButton aria-label="delete" onClick={() => deleteComment(id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        ))}
      </div>
      <form className="post_commentBox" onSubmit={postComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></input>
        <button type="submit" disabled={!comment}>
          <SendIcon />
        </button>
      </form>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          style={{ padding: "10px 30px", fontSize: "20px" }}
          onClick={deletePost}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Posts;
