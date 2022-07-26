/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";
import userReducer, { initialState } from "../reducers/userReducer";

const UserContext = createContext();
console.warn(initialState);

const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

const userContext = () => useContext(UserContext);

export default UserContext;
export { UserContextProvider, userContext };
