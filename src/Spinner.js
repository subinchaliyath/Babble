import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
function Spinner() {
    return (
        <div className="spinner_container" style={{minHeight:'100vh',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <CircularProgress/>
        </div>
    )
}

export default Spinner
