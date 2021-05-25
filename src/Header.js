import React, { useState } from "react";
import "./Header.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import { auth } from "./FirebaseConfig";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import CreatePost from "./CreatePost";
import logo from './Assets/babble.png'
function Header({ user }) {
  let history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showModal, setShowModal] = useState(false)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    auth.signOut();
    handleClose();
  };
  const handleLogin = () => {
    history.push("/login");
  };
  return (
    <div className="header">
      <div className="header_logo">
        <img 
          src={logo}
          alt="logo"
        />
      </div>
      {user ? (
        <div className="header_user_section">
          <Avatar className="header_avatar post_avatar_color" onClick={()=>setShowModal(true)}>+</Avatar>
          <Avatar
            className="header_avatar user_avatar_color"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            alt={user && user.displayName}
            src="/static/images/avatar/1.jpg"
          />
        </div>
      ) : (
        <Button variant="contained" className="header__login__btn" onClick={handleLogin}>
          Login
        </Button>
      )}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          style={{ padding: "10px 30px", fontSize: "20px" }}
          onClick={handleClose}
        >
          Profile
        </MenuItem>
        <MenuItem
          style={{ padding: "10px 30px", fontSize: "20px" }}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>
      {showModal?<CreatePost user={user} showModal={setShowModal}/>:null}
    </div>
  );
}

export default Header;
