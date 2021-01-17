import React from "react";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs.js";
import "./styles.css";
import logo from './Images/AltChecker.jpg'
import TextBox from "./components/CategoryTabs/TextBox.js";
import Table from "./components/Table.js"
import UserInfo from "./components/UserInfo.js";


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
  const handleFieldValueChange = ({ target }) => {
    setSearchField(target.value);
  };  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getResults()
    }
  }

  const getResults = () => {
    if(category==="USER"){
    fetch(`https://alt-checker-az-func.azurewebsites.net/api/HttpTriggerAlt?userinfo=${search_field}`)
    .then((response) => response.json())
    .then((results) => {
      if(results.data){
      setUserInfo(results.data[0]);}
      else{
      setUserInfo(null)
      }
    });
    }
    console.log(userInfo)
    fetch(`https://alt-checker-az-func.azurewebsites.net/api/HttpTriggerAlt?${category === "USER" ? "username" : "rsn"}=${search_field}`)
    .then((response) => response.json())
    .then((results) => {
      console.log(results)
      if(category === "RSN"){
        let result = results.rows.map(a => a.NAME);
        let occurenceCount = new Map([...new Set(result)].map(
          x => [x, result.filter(y => y === x).length]));
        console.log(occurenceCount)
        console.log((occurenceCount.size*10))
        setSusMeter((occurenceCount.size*10))
        setUserInfo(null)
        console.log("holy canoli")
        console.log(results)
        console.log(results.rows)
        if(results && results.rows.length>0){
        fetch(`https://oldschool.tools/ajax/hiscore-stats/${search_field}`)
        .then((response) => response.json())
        .then((results) => {
          console.log(results)
          if(results.data){
          setHiscores(results.data[0]);}
          else{
          setHiscores(null)
          }
        });
      }

      }
      else if(category === "USER"){
        let result = results.rows.map(a => a.MESSAGE);
        let occurenceCount = new Map([...new Set(result)].map(
          x => [x, result.filter(y => y === x).length]));
        console.log(occurenceCount)
        console.log((occurenceCount.size*10))
        setSusMeter((occurenceCount.size*10))
        console.log(susMeter)
      }
      setResults(results);
    });
  };

  return (
    <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      <CategoryTabs category={category} onChange={setCategory} />
      <div className = "label">{category === 'USER' ? 'Enter the twitch username you want to search' : 'Enter the RSN you want to search'}</div>
      <div>
      <TextBox
        name = "input"
        onChange = {handleFieldValueChange}
        onKeyDown = {handleKeyDown}
        value = {search_field}
        />
      <button className = "button2" onClick={getResults}>Search</button>
      </div>
      <div>
        {userInfo ?
        <UserInfo
          hiscores = {hiscores}
          susMeter = {susMeter}
          userName = {userInfo.display_name}
          description ={userInfo.description}
          userId = {userInfo.id}
          image_url = {userInfo.profile_image_url}
          views = {userInfo.view_count}
          accountAge = {yearsToYearsMonthsDays(Math.abs(Date.now() - Date.parse(userInfo.created_at))/31536000000)}
        />:
        category === "USER" ?
        <div className = "label">No User Found</div>
        :
        null
      }
        <Table
              template={results.template}
              rows={results.rows}
              className="center-container"
              rowCount
            />
            </div>
    </div>
  );
};

export default App;
