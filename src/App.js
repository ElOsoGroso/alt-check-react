import React from "react";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs.js";
import "./styles.css";
import logo from './Images/AltChecker.jpg'
import Button from "./components/CategoryTabs/Button.js";


const App = () => {
  const [category, setCategory] = React.useState("USER");
  const [results, setResults] = React.useState([]);
  const [search_field, setSearchField] = React.useState("");
  const handleFirstNameChange = ({ target }) => {
    setSearchField(target.value);
  };
  const getResults = () => {
    console.log(search_field)
    fetch(`https://alt-checker-az-func.azurewebsites.net/api/HttpTriggerAlt?username=${search_field}`)
      .then((response) => response.json())
      .then((results) => {
        setResults(results);
      });
  };

  return (
    <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      <CategoryTabs category={category} onChange={setCategory} />
      <div>{category === 'USER' ? 'Enter the username you want to search' : 'Enter the RSN you want to search'}</div>
      <Button
        name = "input"
        onChange = {handleFirstNameChange}
        value = {search_field}
        />
      <button onClick={getResults}>Search</button>
      <div>{/* Do something with the reuslts */}</div>
    </div>
  );
};

export default App;
