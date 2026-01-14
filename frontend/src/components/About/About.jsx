import { assets } from "../../assets/assets"
import "./About.css"


const About = () => {
    return (
        <div id="about" className="about">
            <div className="about-title">
                <h1>About Me</h1>
                {/* <img src="" alt="" /> */}
            </div>
            <div className="about-section">
                <div className="about-left">
                    <img className ="photo" src={assets.ProfilePic} alt="" />
                </div>
                <div className="about-right">
                    <div className="about-para">
                        <p>I love building interactive web apps that solve real-world problems</p>
                        <p>I am passion for web apps that solve real-world problems</p>
                    </div>
                    <div className="about-skills">
                        <div className="about-skills">
                            <div className="about-skill"><p>HTML & CSS</p><hr style={{ width: "50%" }} /></div>
                            <div className="about-skill"><p>React JS</p><hr style={{ width: "70%" }} /></div>
                            <div className="about-skill"><p>Node JS</p><hr style={{ width: "50%" }} /></div>
                            <div className="about-skill"><p>JavaScript</p><hr style={{ width: "60%" }} /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about-achievements">
                <div className="about-achievement">
                    <h1>1+</h1>
                    <p>YEARS OF EXPERIENCE</p>
                </div>
                <hr />
                <div className="about-achievement">
                    <h1>10+</h1>
                    <p>PROJECT COMPLETED</p>
                </div>
                <hr />
                <div className="about-achievement">
                    <h1>50+</h1>
                    <p>LeetCode Problems Solve</p>
                </div>
            </div>
        </div>
    )
}

export default About