import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
function Spinner() {
    return (
        <div className="spinner_container" style={{padding:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <CircularProgress/>
        </div>
    )
}

export default Spinner
