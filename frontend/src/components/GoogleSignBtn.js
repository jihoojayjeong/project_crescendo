import React from 'react';
import googleLogo from '../assets/google.webp';

const GoogleSignInButton = () => {
    const handleLogin = () => {
        //login stuff
    };

    return (
        <button className="google-sign-in-btn" onClick={handleLogin}>
            <img src={googleLogo} alt="Google logo" className="google-logo" /> 
            Sign in with Google
        </button>
    );
};

export default GoogleSignInButton;
