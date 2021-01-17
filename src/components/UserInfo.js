import React from "react";

const UserInfo = ({susMeter,userName,userId, description,image_url,views,accountAge }) => {

    const meterBar = React.useRef();
    console.log(susMeter)
    React.useEffect(() => {
        let degree = 100 -susMeter
        console.log("degree")
        console.log(degree)
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
        <div className = "hiscores">
        <div className ="statdiv1">
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        </div>
        <div className ="statdiv2">
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        </div>
        </div>
        <div className ="statdiv3">
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="stat">99</p>
        <p className="totallabel">Total:</p>
        <p className="stattotal">99</p>
        </div>
      </div>
  );
};

export default UserInfo;
