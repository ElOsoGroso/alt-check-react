import React from "react";
import HiScores from "./CategoryTabs/Hiscores"

const UserInfo = ({hiscorename,hiscores,susMeter,userName,userId, description,image_url,views,accountAge }) => {
    console.log(hiscores)
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
            <span className="label">Sus Meter:</span><br />
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
        />
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
