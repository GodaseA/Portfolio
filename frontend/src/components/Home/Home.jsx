import React from 'react'
import "./Home.css"
import { assets } from '../../assets/assets'
import AnchorLink from 'react-anchor-link-smooth-scroll'

const Home = () => {
  return (
    <div id='home' className='home'>
      <img className='pic' src={assets.ProfilePic} alt="" />
      <h1><span>I'm Godase Abhijit,</span> Frontend developer</h1>
      <p>I love building interactive web apps that solve real-world problems</p>
      <div className='home-action'>
        <div className="home-connect"><AnchorLink className="anchor-link" offset={50} href="#contact" >connnect with me </AnchorLink> </div>
         
          <a href="/Abhijit_Godase_Resume.pdf"
            download="Abhijit_Godase_Resume.pdf"
            className="home-resume">
            My resume
          </a>

         
      </div>
    </div>
  )
}

export default Home