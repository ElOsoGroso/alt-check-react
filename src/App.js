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
function levenstein(a, b){
  if(!a || !b) return (a || b).length;
  var m = [];
  for(var i = 0; i <= b.length; i++){
      m[i] = [i];
      if(i === 0) continue;
      for(var j = 0; j <= a.length; j++){
          m[0][j] = j;
          if(j === 0) continue;
          m[i][j] = b.charAt(i - 1) === a.charAt(j - 1) ? m[i - 1][j - 1] : Math.min(
              m[i-1][j-1] + 1,
              m[i][j-1] + 1,
              m[i-1][j] + 1
          );
      }
  }
  return m[b.length][a.length];
}

function clearOutCloseValues(map,compareString){
  var keysToRemove = [];

  for (const [key, value] of map.entries()) {
    console.log(value)
    let levensteindist = levenstein(compareString.replace(/\s+/g, ''),key.replace(/\s+/g, ''))
    if(key.toString()!==compareString && key.toString().includes(compareString))
    {
      keysToRemove.push(key)
    }
    else if (levensteindist < 4 && (key.toString()!==compareString)){ //if they just spelled it wrong by 3 letters (assuming no spaces)
      keysToRemove.push(key)
    }
    else if (compareString === "no rsn included"){
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(element => {
    map.delete(element)
  });
  console.log(map)
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
      handleResults(search_field,category)
    }
  }

  const handleLogin = () => {
    netlifyIdentity.open();
  }
  const handleChange = (cat) => {
    setResults([])
    setUserInfo(null)
    setCategory(cat)
    setHiscores(null)
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
  const getFlaggedRSNs = () => {
    trackPromise(
      fetch(`${url}/HttpTriggerAlt?flaggedRSN=true`)
      .then((response) => response.json())
      .then((results) => {
        if(results){
        setResults(results);
      }
        else{
        setResults(null)
        }
      }));
  }
  const getFlaggedUsers = () => {
    trackPromise(
      fetch(`${url}/HttpTriggerAlt?flaggedUser=true`)
      .then((response) => response.json())
      .then((results) => {
        if(results){
          setResults(results);
        }
          else{
          setResults(null)
          }
      }));
  }
  React.useEffect(()=> {
    netlifyIdentity.init({});
    // console.log(netlifyIdentity.currentUser())
    netlifyIdentity.on("close",() => setUser(netlifyIdentity.currentUser()))
  },[]);

  const markUser = () => {
    if(user.user_metadata){
    fetch(`${url}/HttpTriggerAlt?marktype=user&markmessage=${search_field}&siteuser=${user.user_metadata.full_name}`)
    .then((response) => response.json())
    .then((results) => {
      if(results.toString()==="true"){
      setFlagged(true)
    }
    });
    }
  }
  const markRSN = () => {
    if(user.user_metadata){
      fetch(`${url}/HttpTriggerAlt?marktype=rsn&markmessage=${search_field}&siteuser=${user.user_metadata.full_name}`)      
    .then((response) => response.json())
    .then((results) => {
      if(results.toString()==="true"){
        setFlagged(true)
      }
    });
    }
  }

  const getHiscores = (searchThing) => {
    fetch(`https://salty-taiga-58601.herokuapp.com/stats/${searchThing}`)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    }).then((results) => {
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
    }).catch(function(error){
      console.log(error)
      console.log("broken")
        setHiscores(404)
        setHiscoreName("No Results Found For: " + searchThing)
      
    });
  }
  const getUserInfo = (message) => {
    console.log("search field is " + message)
    trackPromise(
      fetch(`${url}/HttpTriggerAlt?userinfo=${message}`)
      .then((response) => response.json())
      .then((results) => {
        if(results.data){
        setUserInfo(results.data[0]);}
        else{
        setUserInfo(null)
        }
      }));
  }
  const getRSNResults = (results,message) => {
    setUserInfo(null)
    let result = results.rows.map(a => a.NAME);
    let occurenceCount = new Map([...new Set(result)].map(
      x => [x, result.filter(y => y === x).length]));
    setSusMeter(susMeter + occurenceCount.size*10)
    if(results && results.rows.length>0)
    {
      getHiscores(message)
    }
  }
  
  const getUserResults = (results) => {
    let result = results.rows.map(a => a.MESSAGE.toLowerCase().trim());
    let occurenceCountMap = new Map([...new Set(result)].map(
      x => [x, result.filter(y => y === x).length]));
    //get the most oft ocurring RSN from the map
    const mapSortUser = new Map([...occurenceCountMap.entries()].sort((a, b) => b[1] - a[1]));
    let searchUser = mapSortUser.keys().next().value
    //Remove noise words, misspellings or extra symbols
    clearOutCloseValues(occurenceCountMap,searchUser)

  if(searchUser !== null && searchUser !== 'undefined')
    {
      getHiscores(searchUser)
      
      let rsnresult = results.rsn_rows.map(a => a.NAME.toLowerCase().trim());
      let rsnOccurenceCountMap = new Map([...new Set(rsnresult)].map(
        x => [x, result.filter(y => y === x).length]));
      setSusMeter((susMeter) => susMeter + (rsnOccurenceCountMap.size*.7+occurenceCountMap.size*.3)*10) //weight the username occurence count alot higher
    }
    else{
      setHiscores(null)
      setResults([])
    }

  }
  const handleResults = (message,category) => {
    if(category==="USER"){
      getUserInfo(message)
    }
    trackPromise(
      fetch(`${url}/HttpTriggerAlt?${category === "USER" ? "username" : "rsn"}=${message}`)
      .then((response) => response.json())
        .then((results) => {
          setSusMeter(0)
          setHiscores(null)
          if(category === "RSN"){
            getRSNResults(results,message)
          }
          else if(category === "USER"){
            getUserResults(results)
          }
          if(results.flagged || susMeter > 100){
            setSusMeter(100)
          }
          setFlagged(results.flagged)
          setResults(results)
      }));

  }
  const clickCell = (message,id) => {
    let cat = ""
    if(message != null){
      setSearchField(message)
      if(id === "MESSAGE" || id === "FLAGGED_USER"){
        setCategory("RSN")
        cat = "RSN"
      }
      else{
        setCategory("USER")
        cat = "USER"
      }
      handleResults(message,cat)
    }
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
            {category === "USER" || category === "RSN" ? 
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
                <button className="button2" onClick={() => handleResults(search_field,category)}>
                  Search
                </button>
              </div> 
            </div>: <div className="labelbig">
                {category === "FLAGUSER"
                  ? "List of All Flagged Users"
                  : "List of All Flagged RSNs"}
              </div> }
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
                <div className = "RSN_HISCORE_CONTAIN">
                <HiScores  hiscores={hiscores} username={hiscoreName} />
                <div className="meter-alt-container">
                {
                  user.app_metadata.roles && user.app_metadata.roles[0] === "Admin" ?
                <button className = "markSusRSN" onClick={markRSN}>Flag This RSN</button> : null}
                {flagged ? 
                <div className = "altImg">
                  <img className ="imagealt" alt = "nothing" src ={altImage}></img>
                </div> : null}
                </div>
                </div>
              ) : category === "USER" ? (
                <div className="label">No User Found</div>
              ) : category === "RSN" ? (
                <div className="label">No RSN Found</div>
              ) : null}
              {results.rows && results.rows.length > 0 && results.rsn_rows && results.rsn_rows.length > 0 ?
                <div className="tablecontainer">
                <Table
                  template={results.template}
                  rows={results.rows}
                  className="center-container"
                  rowCount
                  clickCell = {clickCell}
                  title = {"RSNs Entered By: " + search_field}
                />
                <Table
                  template={results.rsn_template}
                  rows={results.rsn_rows}
                  className="center-container"
                  rowCount
                  clickCell = {clickCell}
                  title = {"Twitch Accounts That Used RSN: " + results.most_frequent}

                /></div> : (results.rows && results.rows.length > 0) && (category === "USER" || category === "RSN") ?                 
                <Table
                template={results.template}
                rows={results.rows}
                className="center-container"
                rowCount
                clickCell = {clickCell}
                title = {"Twitch Accounts That Used RSN: " + search_field}
              /> : category === "FLAGRSN" || category === "FLAGUSER" ?
              <Table
                template={results.template}
                rows={results.rows}
                className="center-container"
                rowCount
                clickCell = {clickCell}
                title = ""
              /> :
              null}
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
