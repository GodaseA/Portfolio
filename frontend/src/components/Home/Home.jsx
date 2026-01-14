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
        <div className="home-connect"><AnchorLink className="anchor-link" offset={50} href="#contact">connnect with me </AnchorLink> </div>
        <div className="home-resume">My resume</div>
      </div>
    </div>
  )
}

export default Home