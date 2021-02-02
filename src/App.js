import React from "react";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs.js";
import "./styles.css";
import TextBox from "./components/CategoryTabs/TextBox.js";
import Table from "./components/Table.js"
import UserInfo from "./components/UserInfo.js";
import HiScores from "./components/CategoryTabs/Hiscores.js";
import netlifyIdentity from "netlify-identity-widget";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import altImage from "./Images/AltGnome.png"

function yearsToYearsMonthsDays(value)
{
    var totalDays = value * 365;
    var years = Math.floor(totalDays/365);
    var months = Math.floor((totalDays-(years *365))/30);
    var days = Math.floor(totalDays - (years*365) - (months * 30));
    var result = years + " years, " + months + " months, " + days + " days";
    return result
}

const App = () => {
  const [category, setCategory] = React.useState("USER");
  const [results, setResults] = React.useState([]);
  const [search_field, setSearchField] = React.useState("");
  const [userInfo, setUserInfo] = React.useState(null);
  const [susMeter,setSusMeter] = React.useState(10);
  const [hiscores,setHiscores] = React.useState(null);
  const [hiscoreName,setHiscoreName] = React.useState("");
  const [user,setUser] = React.useState(null);
  const {promiseInProgress} = usePromiseTracker();
  const [flagged,setFlagged] = React.useState(false);
  const handleFieldValueChange = ({ target }) => {
    setSearchField(target.value);
  };  
  // const url = 'http://localhost:7071/api'
  const url = 'https://alt-checker-az-func.azurewebsites.net/api'
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleResults()
    }
  }

  const handleLogin = () => {
    netlifyIdentity.open();
  }
  const handleChange = (cat) => {
    setCategory(cat)
    if(cat==="FLAGRSN" || cat==="FLAGUSER"){
      setUserInfo(null)
      setHiscores(null)
      if(cat ==="FLAGRSN"){
        getFlaggedRSNs()
      }
      else{
        getFlaggedUsers()
      }
    }
  }
  React.useEffect(()=> {
    netlifyIdentity.init({});
    console.log(netlifyIdentity.currentUser())
    netlifyIdentity.on("close",() => setUser(netlifyIdentity.currentUser()))

  },[]);

  const markUser = () => {
    if(user.user_metadata){
    fetch(`${url}/HttpTriggerAlt?marktype=user&markmessage=${search_field}&siteuser=${user.user_metadata.full_name}`)
    .then((response) => response.json())
    .then((results) => {
      if(results.data){
      setFlagged(true)
      setUserInfo(results.data[0]);}
      else{
      setUserInfo(null)
      }});
    }
  }
  const markRSN = () => {
    if(user.user_metadata){
      fetch(`${url}/HttpTriggerAlt?marktype=rsn&markmessage=${search_field}&siteuser=${user.user_metadata.full_name}`)      
    .then((response) => response.json())
    .then((results) => {
      if(results.data){
      setUserInfo(results.data[0]);}
      else{
      setUserInfo(null)
      }});
    }
  }

  const getFlaggedRSNs = () => {
    trackPromise(
      fetch(`${url}/HttpTriggerAlt?flaggedRSN=true`)
      .then((response) => response.json())
      .then((results) => {
        if(results.data){
        console.log(results.data)
        setUserInfo(results.data[0]);
      }
        else{
        setUserInfo(null)
        }
      }));
  }
  const getFlaggedUsers = () => {
    trackPromise(
      fetch(`${url}/HttpTriggerAlt?flaggedUser=true`)
      .then((response) => response.json())
      .then((results) => {
        if(results.data){
        console.log(results.data)
        setUserInfo(results.data[0]);
      }
        else{
        setUserInfo(null)
        }
      }));
  }
  const getUserInfo = () => {
    trackPromise(
      fetch(`${url}/HttpTriggerAlt?userinfo=${search_field}`)
      .then((response) => response.json())
      .then((results) => {
        if(results.data){
        console.log(results.data)
        setUserInfo(results.data[0]);}
        else{
        setUserInfo(null)
        }
      }));
  }
  const getRSNResults = (results) => {
    setUserInfo(null)
    let result = results.rows.map(a => a.NAME);
    // let susCount = 0
    let occurenceCount = new Map([...new Set(result)].map(
      x => [x, result.filter(y => y === x).length]));
    setSusMeter(susMeter + occurenceCount.size*10)
    // susCount += susCount + occurenceCount.size*10;
    if(results && results.rows.length>0)
    {
      fetch(`https://salty-taiga-58601.herokuapp.com/stats/${search_field}`)
      .then((response) => response.json())
      .then((results) => {
        if(results.skills){
          setHiscores(results.skills);
          if(results.skills.overall.level <1500){
          setSusMeter(susMeter + 10)
          // susCount = susCount + 10;
          }
          setHiscoreName(search_field);
        }
        else{
          setHiscores(null)
          setHiscoreName("")
        }
      });
}
  }

  const getUserResults = (results) => {
    let result = results.rows.map(a => a.MESSAGE.toLowerCase().trim());
    let occurenceCount = new Map([...new Set(result)].map(
      x => [x, result.filter(y => y === x).length]));
    setSusMeter((susMeter) => susMeter + occurenceCount.size*10)
    const mapSort1 = new Map([...occurenceCount.entries()].sort((a, b) => b[1] - a[1]));
    let searchThing = mapSort1.keys().next().value
    fetch(`https://salty-taiga-58601.herokuapp.com/stats/${searchThing}`)
    .then((response) => response.json())
    .then((results) => {
      if(results.skills){
        setHiscores(results.skills);
        if(results.skills.overall.level <1500){
          setSusMeter((susMeter) => susMeter + 10)
        }
        setHiscoreName(searchThing);
      }
      else{
        setHiscores(null)
        setHiscoreName("")
      }
    });
    //  return susCount;
  }
  const handleResults = () => {
    if(category==="USER"){
      getUserInfo()
    }
    trackPromise(
      fetch(`${url}/HttpTriggerAlt?${category === "USER" ? "username" : "rsn"}=${search_field}`)
      .then((response) => response.json())
        .then((results) => {
          setSusMeter(0)
          console.log("inside")
          if(category === "RSN"){
            console.log("rsn")
            getRSNResults(results)
          }
          else if(category === "USER"){
            console.log("user")
            getUserResults(results)
          }
          console.log(results)
          if(results.flagged || susMeter > 100){
            setSusMeter(100)
          }
          console.log(susMeter);
          console.log(results.flagged)
          setFlagged(results.flagged)
          setResults(results);
      }));
  }

  return (
    <div>
      <header className="App-header">
        <div className="empty"></div>
        {user ?
        <button className="logout" onClick={handleLogin}>Logout</button>
        :null}
      </header>
      {user && !promiseInProgress ? (
        <>
          <CategoryTabs category={category} onChange={handleChange} />
          <div>
            <div className="label">
              {category === "USER"
                ? "Enter the twitch username you want to search"
                : "Enter the RSN you want to search"}
            </div>
            <div>
              <TextBox
                name="input"
                onChange={handleFieldValueChange}
                onKeyDown={handleKeyDown}
                value={search_field}
              />
              <button className="button2" onClick={handleResults}>
                Search
              </button>
            </div>
            <div className={category === "RSN" ? "marginHi" : null}>
              {userInfo && category === 'USER'? (
                <UserInfo
                  flagged = {flagged}
                  markUser = {markUser}
                  user={user}
                  hiscorename={hiscoreName}
                  hiscores={hiscores}
                  susMeter={susMeter}                
                  userName={userInfo.display_name}
                  description={userInfo.description}
                  userId={userInfo.id}
                  image_url={userInfo.profile_image_url}
                  views={userInfo.view_count}
                  accountAge={yearsToYearsMonthsDays(
                    Math.abs(Date.now() - Date.parse(userInfo.created_at)) /
                      31536000000
                  )}
                />
              ) : !userInfo && hiscores && category === 'RSN' ? (
                <div>
                <HiScores hiscores={hiscores} username={hiscoreName} />
                <div className="meter-alt-container">
                {
                  user.app_metadata.roles[0] === "Admin" ?
                <button className = "markSusRSN" onClick={markRSN}>Flag This RSN</button> : null}
                {flagged ? 
                <div className = "altImg">
                  <img className ="imagealt" alt = "nothing" src ={altImage}></img>
                </div> : null}
                </div>
                </div>
              ) : category === "USER" ? (
                <div className="label">No User Found</div>
              ) : null}
              <Table
                template={results.template}
                rows={results.rows}
                className="center-container"
                rowCount
              />
            </div>
          </div>
        </>
      ) : promiseInProgress ?     <div
            style={{
              width: "100%",
              height: "100",
              display: "flex",
             justifyContent: "center",
             alignItems: "center"
            }}
          >
            <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
          </div>
        :
        <button className="loginbutton" onClick={handleLogin}>
          </button> }
    </div>
  );
};
export default App;
