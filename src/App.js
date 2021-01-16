import React from "react";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs.js";
import "./styles.css";
import logo from './Images/AltChecker.jpg'
import TextBox from "./components/CategoryTabs/TextBox.js";
import Table from "./components/Table.js"

const App = () => {
  const [category, setCategory] = React.useState("USER");
  const [results, setResults] = React.useState([]);
  const [search_field, setSearchField] = React.useState("");
  const handleFieldValueChange = ({ target }) => {
    setSearchField(target.value);
  };
  const handleKeyDown = (e) => {
    console.log('hi')
    if (e.key === 'Enter') {
      console.log('Enter')
      getResults()
    }
  }
  const getResults = () => {
    console.log(search_field)

    fetch(`https://alt-checker-az-func.azurewebsites.net/api/HttpTriggerAlt?username=${search_field}`)
      .then((response) => response.json())
      .then((results) => {
        setResults(results);
      });
      console.log(results.rows)
      console.log(results.template)
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
