    // import { useEffect } from "react";
    // import { useNavigate } from "react-router-dom";

    // function Login() {
    // const navigate = useNavigate();

    // useEffect(() => {
    //     // Check if Google sent a token in the URL
    //     const params = new URLSearchParams(window.location.search);
    //     const token = params.get("token");

    //     if (token) {
    //     // Save token to localStorage
    //     localStorage.setItem("token", token);

    //     navigate("/");
    //     }
    // }, [navigate]);

    // function handle_login() {
    //     window.location.href = "http://localhost:5000/auth/google";
    // }

    // return (
    //     <>
    //     <button onClick={handle_login}>Login with Google</button>
    //     </>
    // );
    // }

    // export default Login;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const picture = params.get("picture");

    if (token) {
      // Save token and user info to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("picture", picture);

      navigate("/");
    }
  }, [navigate]);

  const handle_login = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <button onClick={handle_login}>Login with Google</button>
  );
}

export default Login;
