import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(true);

  const loginUser = async (email, password, navigate, fetchMyCourses) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate('/');
      fetchMyCourses();
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.response.data.message);
    }
  };

  const registerUser = async (name, email, password, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate('/verify');
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const verifyOtp = async (otp, navigate) => {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        activationToken,
        otp
      })

      toast.success(data.message);
      localStorage.clear();
      setBtnLoading(false);
      navigate("/login");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);
    }
  }

  const fetchUser = async () =>{
    try {
        const { data } = await axios.get(`${server}/api/user/me`, {
            headers:{
                token : localStorage.getItem("token")
            }
        });

        setUser(data.user);
        setIsAuth(true);
        setLoading(false);

    } catch (error) {
        console.log(error);
        setLoading(false)
    }
  }

  useEffect(()=>{
    fetchUser()
  },[])

  return (
    <UserContext.Provider value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        btnLoading,
        loginUser,
        loading,
        fetchUser,
        registerUser,
        verifyOtp
    }}>
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
