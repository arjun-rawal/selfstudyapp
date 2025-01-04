import React, { useEffect } from "react";

//This is code is mostly taken from the google oauth documentation, it loads the script grom google and displays the sign in with google button


/** 
 * Google Sign in button
 */
const GoogleSignInButton = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); 
    };
  }, []);
  return (
    <div>

      <div
        id="g_id_onload"
        data-client_id={process.env.GOOGLE_CLIENT_ID} 
        data-login_uri= {process.env.GOOGLE_REDIRECT_URL}
        data-auto_prompt = "false"
      ></div>
      <div
        className="g_id_signin" 
        data-type="standard"
        data-size="large"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"  
        data-theme = "filled_black"

        
      ></div>
    </div>
  );
};

export default GoogleSignInButton;