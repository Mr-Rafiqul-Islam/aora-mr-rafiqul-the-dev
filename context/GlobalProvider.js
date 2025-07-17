import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        if (result) {
          setUser(result);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
