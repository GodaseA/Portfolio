import React from 'react'
import "./Project.css"
import { assets } from '../../assets/assets'
import Project_Data  from '../../assets/Project_Data'
import arrow_icon from '../../assets/Icons'


const Project = () => {
  return (
    <div id='project' className='project'>
        <div className="project-title">
             <h1>My Latest Projects</h1>
            {/* <img src={assets.ProfilePic} alt="" /> */}
        </div>
        <div className="project-container">
                {Project_Data.map((project,index)=>{
                   return <img  key={index} src={project.p_img} alt="" />
                })}
        </div>
        <div className="project-showmore">
            <p>Show More</p>
            <img src={arrow_icon} alt="" />
        </div>
           
    </div>
  )
}

export default Project