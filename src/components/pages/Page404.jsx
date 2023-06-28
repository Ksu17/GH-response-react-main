import React from 'react';
import '../styles/Page404.css'
import {Link} from "react-router-dom";
import {isMobile} from 'react-device-detect';

const Page404 = () => {
    return (
        <div className='Container flexed'>
            <h1 className='mainlabel label404'>404<br/><span style={{fontSize:'.5em'}}>Not found</span></h1>
            <Link to='/' style={isMobile ? {fontSize:'3em', padding:'0px 0px 10px 0px'} : {}} className='mainlabel homeLink'>/Go back to home</Link>
        </div>
    );
};

export default Page404;