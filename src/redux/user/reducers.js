import { CLEAR_USER, SET_USER } from "./action";
// Gets called everytime dispatch function is called
// irespective of the action and payload.
export const userReducer=(state=null,action)=>{
    switch(action.type){


        // This action helps in login functionality
        case SET_USER:
            return action.payload;


        // This case helps in logout functionality.
        case CLEAR_USER:
            return null;
        
        // This case helps in handling cases where userReducer
        // is inovked due to change in some other state variable 
        // maintained by redux.
        default:
            return state;
    }
}
