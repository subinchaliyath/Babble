import React from "react";
import "./Posts.css";
import Avatar from "@material-ui/core/Avatar";
const Posts = ({ username, imageUrl, caption }) => {
  return (
    <div className="post_main">
      <div className="post_header">
        <Avatar alt={username} src="/static/images/avatar/1.jpg" />
        <h3>{username}</h3>
      </div>
      <div>
        <img className="post_image" src={imageUrl} alt="post-img" />
      </div>
      <h4 className="post_caption">
        <strong>{username}</strong>
        {"  "}
        {caption}
      </h4>
    </div>
  );
};

export default Posts;
