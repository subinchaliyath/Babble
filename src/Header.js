import React from "react";
import "./Header.css";
const Header = ({ user }) => {
  return (
    <div className="header">
      <div>
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png%202x"
          alt="logo"
        />
      </div>
      <h3 className="header_user_section">{user && user.displayName}</h3>
    </div>
  );
};

export default Header;
