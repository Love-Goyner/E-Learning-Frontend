import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { UserData } from "../../context/UserContext";

const CourseDescription = ({ user, setUser }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { fetchCourse, course, fetchCourses, fetchMyCourses } = CourseData();
  const { fetchUser } = UserData();
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/addcourse/${params.id}`, {
        headers: {
          token,
        },
      });

      await fetchUser();
      await fetchCourses();
      await fetchMyCourses();

      toast.success(data.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt=""
                  className="course-image"
                />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.createdBy}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
              </div>

              <p>{course.description}</p>

              <p>Let's get started with course At ₹{course.price}</p>

              {user && user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button onClick={submitHandler} className="common-btn">
                  Buy Now
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
