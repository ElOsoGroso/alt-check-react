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
  const handleFieldValueChange = ({ target }) => {
    setSearchField(target.value);
  };  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getResults()
    }
  }
  const handleLogin = () => {
    netlifyIdentity.open();
  }

  React.useEffect(()=> {
    netlifyIdentity.init({});
    console.log(netlifyIdentity.currentUser())
    netlifyIdentity.on("close",() => setUser(netlifyIdentity.currentUser()))
   
  },[]);

  const getResults = () => {
  
    if(category==="USER"){
      trackPromise(
    fetch(`https://alt-checker-az-func.azurewebsites.net/api/HttpTriggerAlt?userinfo=${search_field}`)
    .then((response) => response.json())
    .then((results) => {
      if(results.data){
      setUserInfo(results.data[0]);}
      else{
      setUserInfo(null)
      }
    }));
    }
    fetch(`https://alt-checker-az-func.azurewebsites.net/api/HttpTriggerAlt?${category === "USER" ? "username" : "rsn"}=${search_field}`)
    .then((response) => response.json())
    .then((results) => {
      if(category === "RSN"){
        let result = results.rows.map(a => a.NAME);
        let occurenceCount = new Map([...new Set(result)].map(
          x => [x, result.filter(y => y === x).length]));
        setSusMeter((occurenceCount.size*10))
        setUserInfo(null)

        if(results && results.rows.length>0)
        {
        fetch(`https://salty-taiga-58601.herokuapp.com/stats/${search_field}`)
        .then((response) => response.json())
        .then((results) => {
          if(results.skills){
          setHiscores(results.skills);
          setHiscoreName(search_field);
        }
          else{
          setHiscores(null)
          setHiscoreName("")
          }
        });
      }

      }
      else if(category === "USER"){
        let result = results.rows.map(a => a.MESSAGE);
        let occurenceCount = new Map([...new Set(result)].map(
          x => [x, result.filter(y => y === x).length]));
        const mapSort1 = new Map([...occurenceCount.entries()].sort((a, b) => b[1] - a[1]));
        let searchThing = mapSort1.keys().next().value
        fetch(`https://salty-taiga-58601.herokuapp.com/stats/${searchThing}`)
        .then((response) => response.json())
        .then((results) => {
          if(results.skills){
            setHiscores(results.skills);
            setHiscoreName(searchThing);
          }
          else{
            setHiscores(null)
            setHiscoreName("")
          }
          setSusMeter((occurenceCount.size*10))
        });
      }
      setResults(results);
    });
  };

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
          <CategoryTabs category={category} onChange={setCategory} />
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
              <button className="button2" onClick={getResults}>
                Search
              </button>
            </div>
            <div className={category === "RSN" ? "marginHi" : null}>
              {userInfo ? (
                <UserInfo
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
              ) : !userInfo && hiscores ? (
                <HiScores hiscores={hiscores} username={hiscoreName} />
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
