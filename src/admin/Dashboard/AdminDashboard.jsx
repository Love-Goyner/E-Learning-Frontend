import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import Layout from '../Utils/Layout';
import toast from 'react-hot-toast';
import { server } from '../../main';
import axios from "axios"
import "./dashboard.css"

const AdminDashboard = ({user}) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);

    const fetchStats = async () => {
      try {
        const {data} = await axios.get(`${server}/api/stats`,{
          headers:{
            token : localStorage.getItem("token")
          }
        })
        setStats(data.stats)
      } catch (error) {
        toast.error(error.response.data.message); 
      }
    }
 
    useEffect(() => {
        if(user && user.role !== "admin" ) return navigate('/');
        fetchStats();
    }, [])

  return (
    <div>
      <Layout>
        <div className="main-content">
          <div className="box">
            <p>Total Courses</p>
            <p>{stats.courses}</p>
          </div>
          <div className="box">
            <p>Total Lectures</p>
            <p>{stats.lectures}</p>
          </div>
          <div className="box">
            <p>Total Users</p>
            <p>{stats.users}</p>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default AdminDashboard