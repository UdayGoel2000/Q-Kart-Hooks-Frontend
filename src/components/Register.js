import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  let [userName,setUserName] = useState("");
  let [password,setPassword] = useState("");
  let [confirmPassword,setConfirmPassword] = useState("");
  let [registered,setRegistered] = useState("Registered")


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    setRegistered("Registering")
    // console.log(config.endpoint)
    let url = `${config.endpoint}/auth/register`
    
    if(validateInput(formData)){
      let res
      // console.log("register function",formData)
      try{
      res = await axios.post(url,
      {username: formData.username,
      password: formData.password}
      )
      // console.log(res)
      // console.log(res.status)
      if(res.status===201){
        enqueueSnackbar("Registered successfully",{variant:'success'})
        history.push("/login")
      }
      setRegistered("Registered")
    }
      catch(e){
        // enqueueSnackbar(e)
        // console.log("hi")
        // console.log(e.response.data);
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
    setRegistered("Registered")
    // else{
    //   enqueueSnackbar(validationMessage)
    // }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    // console.log(data)
    if(data.username){
      if(data.username.length>=6){
        if(data.password){
          if(data.password.length>=6){
            if(data.password===data.confirmPassword){
              return true;
            }
            else{
              enqueueSnackbar("Passwords do not match",{variant:'error'})
              return false;
            }
          }
          else{
            enqueueSnackbar("Password must be at least 6 characters",{variant:'error'})
            return false;
          }
        }
        else{
          enqueueSnackbar("Password is a required field",{variant:'error'})
          return false;
        }
      }
      else{
        enqueueSnackbar("Username must be at least 6 characters",{variant:'error'})
        return false;
      }
    }
    else{
      enqueueSnackbar("Username is a required field",{variant:'error'})
      return false;
    }
  };

  let registerOption = (
    registered!=='Registering'?
    <Button className="button" variant="contained" onClick={()=>{register({username:userName,password:password,confirmPassword:confirmPassword})}}>
    Register Now
    </Button>:
    <Box display="flex" justifyContent="center">
      <CircularProgress color="success" />
    </Box>
  );

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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={(e)=>{setUserName(e.target.value)}}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(e)=>{setPassword(e.target.value)}}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={(e)=>{setConfirmPassword(e.target.value)}}
          />
          {registerOption}
          <p className="secondary-action">
            Already have an account?{" "}
             {/* <a className="link" href="#">
              Login here
             </a> */}
             <Link to="/login" >Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
