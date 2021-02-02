import React from "react";
import HiScores from "./CategoryTabs/Hiscores"
import altImage from "../Images/AltGnome.png"
const UserInfo = ({flagged,markUser,user,hiscorename,hiscores,susMeter,userName,userId, description,image_url,views,accountAge }) => {
    const meterBar = React.useRef();
    React.useEffect(() => {
        let degree = 100 -susMeter
        meterBar.current.style.setProperty(
            "--meter-color",
            `hsl(${degree}, 100%, 50%)`
        );
        }, [susMeter]);
  return (
      <div className = "usercontainer">     
            <div className = "profileimg">  
          <img src= {image_url} alt="Meaningful text"></img>
          </div>  
          <div className ="userinfo">
            <span className="label">Username:</span><br /><span className = "infoItem"> {userName}</span><br />
            <span className="label">User ID:</span><br /><span className = "infoItem"> {userId}</span><br />
            <span className="label">Description:</span><br /><span className = "infoItem"> {description}</span><br />
            <span className="label">Views:</span><br /><span className = "infoItem"> {views}</span><br />
            <span className="label">Account Age:</span><br /><span className = "infoItem"> {accountAge}</span><br />
            <span className="label">Sus-O-Meter:</span><br />
            
            <div className = "meter-alt-container">
              <div className ="firstmeter">
                <div
                  class="meter"
                  role="meter"
                  aria-valuenow={susMeter}
                  aria-valuemin="10"
                  aria-valuemax="100"
                >
               
                <div
                  ref={meterBar}
                  class="meter-bar"
                  style={{ width: `${susMeter}%` }}
                >          
              </div>
            </div>
          { 
          user.app_metadata.roles[0] === "Admin" ?
            <button className = "markSus" onClick={markUser}>Flag This User</button> : null}          
          </div>
          {flagged ? 
          <div className = "altImg">
            <img className ="imagealt" alt = "nothing" src ={altImage}></img>
          </div> : null}
          </div>
         </div>
        
          {
        hiscores ?
        <HiScores
          hiscores = {hiscores} 
          username = {hiscorename}
        /> : null}
        </div>
  );
};

export default UserInfo;
