import React from 'react'
import "./Footer.css"
import footer_logo from "../../assets/footer_logo.svg"
import user_icon from "../../assets/user_icon.svg"
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div id='footer' className='footer'>
        <div className="footer-top">
            <div className="footer-top-left">
                    <img className='ppp' src={assets.ProfilePic} alt="" />
                    <p>I am a Full Stack developer,I am in 3rd year persuing Computer Engineering at GCOEARA </p>
            </div>
            <div className="footer-top-right">
                <div className="footer-email-input">
                    <img src={user_icon} alt="" />
                    <input type="email" placeholder='Enter your email'/>
                </div>
                <div className="footer-subscribe">
                    Subscribe
                </div>
            </div>
        </div>
        <hr />
        <div className="footer-bottom">
            <p className="footer-bottom-left">
                # 2025 Abhitij Godase.All rights are reserve 
            </p>
            <div className="footer-botoom-right">
                <p>Term and  Services</p>
                <p>Privacy Policy</p>
                <p>Connect with me</p>
            </div>
        </div>
    </div>
  )
}

export default Footer