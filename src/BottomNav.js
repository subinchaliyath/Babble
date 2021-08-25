import React from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AddBoxIcon from '@material-ui/icons/AddBox';
import './BottomNav.css'
import CreatePost from "./CreatePost";
import { useHistory } from "react-router";
import { auth } from "./FirebaseConfig";

function BottomNav({user}) {
    const [value, setValue] = React.useState();
    const [showModal, setShowModal] = React.useState(false)
    const history = useHistory()
    const handleLogout = () => {
        history.push('/')
        auth.signOut()
    }
  return (
    <footer className="bottomNav_container">
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
    >
      <BottomNavigationAction label="Profile" onClick={()=>history.push('/profile')} icon={<AccountBoxIcon />} />
      <BottomNavigationAction label="Post" onClick={()=>setShowModal(true)} icon={<AddBoxIcon />} />
      <BottomNavigationAction label="Logout" onClick={handleLogout} icon={<ExitToAppIcon />} />
    </BottomNavigation>
    {showModal?<CreatePost user={user} showModal={setShowModal}/>:null}

    </footer>
  );
}

export default BottomNav;
