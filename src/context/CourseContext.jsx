import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import axios from "axios"

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  const fetchCourse = async (id) => {
    try {
      const {data} = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${server}/api/course/all`);
      setCourses(data.courses);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyCourses = async () => {
    const token = localStorage.getItem("token");
    try {
      const {data} = await axios.get(`${server}/api/mycourse`, {
        headers:{
          token
        }
      })
      setMyCourses(data.courses);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchMyCourses();
  }, []);

  return (
    <CourseContext.Provider value={{ courses, fetchCourses, fetchCourse, course, fetchMyCourses, myCourses }}>
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);
