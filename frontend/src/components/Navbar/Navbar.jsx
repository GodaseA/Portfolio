import "./Navbar.css"
import { assets } from "../../assets/assets";
import { useRef, useState } from "react";
import underline from "../../assets/nav_underline.svg";
import menu_open from "../../assets/menu_open.svg";
import menu_close from "../../assets/menu_close.svg";

import AnchorLink from "react-anchor-link-smooth-scroll";

const Navbar = () => {

  const [menu, setMenue] = useState("home");
  const menuRef = useRef();

  const openMenu = () => {
    menuRef.current.style.right = "0";
  }
  const closeMenu = () => {
    menuRef.current.style.right = "-350px";
  }

  return (
    <div className="navbar">
      <img className="logo" src={assets.ProfilePic} alt="" />
      <img src={menu_open} onClick={openMenu} className="nav-mob-open" alt="" />
      <ul ref={menuRef} className="nav-menu">
        <img src={menu_close} alt="" onClick={closeMenu} className="nav-mob-close" />
        <li><AnchorLink className="anchor-link" href="#home"><p onClick={() => setMenue("home")}>Home</p> </AnchorLink>{menu === "home" ? <img src={underline} alt /> : <></>}</li>
        <li><AnchorLink className="anchor-link" offset={50} href="#about"><p onClick={() => setMenue("about")}>about</p></AnchorLink>{menu === "about" ? <img src={underline} alt /> : <></>}</li>
        <li><AnchorLink className="anchor-link" offset={50} href="#project"><p onClick={() => setMenue("project")}>Projects</p></AnchorLink>{menu === "project" ? <img src={underline} alt /> : <></>}</li>
        <li><AnchorLink className="anchor-link" offset={50} href="#experince"><p onClick={() => setMenue("experince")}>Experience</p></AnchorLink>{menu === "experince" ? <img src={underline} alt /> : <></>}</li>
        <li><AnchorLink className="anchor-link" offset={50} href="#contact"><p onClick={() => setMenue("contact")}>Contact</p></AnchorLink>{menu === "contact" ? <img src={underline} alt /> : <></>}</li>
      </ul>
      <div className="nav-connect"><AnchorLink className="anchor-link" offset={50} href="#contact">connect with me</AnchorLink></div>

    </div>
  );
};

export default Navbar;
