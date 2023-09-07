import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory} from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  // console.log(children,hasHiddenAuthButtons)

  let userName = localStorage.getItem("username")
 
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon" />
        </Box>
        {children}
        {
          hasHiddenAuthButtons
          ?
            <Button
              className="explore-button"
              startIcon={<ArrowBackIcon />}
              variant="text"
              onClick={()=>{history.push("/")}}
            >
              Back to explore
            </Button>
          :
            userName
            ?
              <Box>
                
                  {/* <img src="avatar.png" alt={userName} /> */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar alt={userName} src="avatar.png" />

                    <Typography variant="subtitle1" component="div">
                      {userName}
                    </Typography>
                                       
                    <Button
                      className="explore-button"
                      name="logout"
                      variant="text"
                      onClick={()=>{
                        localStorage.clear();
                        window.location.reload()
                        // history.push("/")
                      }}
                    >
                      LOGOUT
                    </Button>
                    
                  </Stack>               
                
              </Box>
            :
              <Box>
                <Button
                  className="explore-button"
                  variant="text"
                  onClick={()=>{history.push("/login")}}
                >
                  LOGIN
                </Button>
                <Button
                  // className="explore-button"
                  variant="contained"
                  onClick={()=>{history.push("/register")}}
                >
                  REGISTER
                </Button>
              </Box>
        }
        </Box>
    );
};

export default Header;
