import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
//Register user

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login user--- token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // save in local storage
      const { token } = res.data;
      //set token in local
      localStorage.setItem("jwtToken", token);
      //token to auth header
      setAuthToken(token);
      //decode token for user data
      const decoded = jwt_decode(token);
      //curent user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//logout
export const logoutUser = () => dispatch => {
  //remove toekn from local storage
  localStorage.removeItem("jwtToken");
  //remove auth header
  setAuthToken(false);
  //set user to empty obj
  dispatch(setCurrentUser({}));
};
