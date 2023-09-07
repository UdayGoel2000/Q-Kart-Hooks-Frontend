import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  let [formData,setFormData] = useState({username:'',password:''})
  
  let [logined,setLogined] = useState("LoggedIn")

  function handleInput(e){
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    console.log(formData)
    setLogined("LoggingIn")
    // console.log(config.endpoint)
    let url = `${config.endpoint}/auth/login`
    console.log(url)
    if(validateInput(formData)){
      let res
      // console.log("register function",formData)
      try{
      res = await axios.post(url,{username:formData.username,password:formData.password})
      // console.log(res)
      // console.log(res.data)
      // console.log(res.data.token)
      // console.log(res.data.username)
      // console.log(res.data.balance)
      if(res.status===201){
        enqueueSnackbar("Logged in successfully",{variant:'success'})
        persistLogin(res.data.token,res.data.username,res.data.balance)
        history.push("/")
      }
      setLogined("LoggedIn")
    }
      catch(e){
        // enqueueSnackbar(e)
        // console.log("hi")
        // console.log(e.response.data);
        // console.log(e.response.data.message);
        // console.log(e.response.status);
        // console.log(e.response.headers);
        if(e.response.status===400){
          enqueueSnackbar(e.response.data.message,{variant:'warning'})
        }
        else{
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:'error'})
        }
      }
    }
    // setLogined("LoggedIn")
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if(data.username){
        if(data.password){
          return true;
        }
        else{
          enqueueSnackbar("Password is a required field",{variant:'error'})
          return false;
        }
    }
    else{
      enqueueSnackbar("Username is a required field",{variant:'error'})
      return false;
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    // console.log(username)
    localStorage.setItem("token",token)
    localStorage.setItem("username",username)
    localStorage.setItem("balance",balance)
    // console.log(JSON.parse(localStorage.getItem("loginState")))
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
        <TextField
            id="username"
            label="username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value = {formData.username}
            onChange={handleInput}
          />
          <TextField
            id="password"
            variant="outlined"
            label="password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value = {formData.password}
            onChange={handleInput}
          />
          <Button className="button" variant="contained" onClick={()=>{login(formData)}}>
          LOGIN TO QKART
          </Button>
          <p className="secondary-action">
            Don’t have an account?{" "}
            {/* <a className="link" href="#">
            Register now
            </a> */}
            <Link to="/register" >Register now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
