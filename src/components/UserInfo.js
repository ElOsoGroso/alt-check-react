import React from "react";

const UserInfo = ({userName,userId, description,image_url,views,accountAge }) => {
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
          </div>
      </div>
  );
};

export default UserInfo;
