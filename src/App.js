import React from "react";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs.js";
import "./styles.css";

const App = () => {
  const [category, setCategory] = React.useState("defaultCategory");
  const [results, setResults] = React.useState([]);

  const getResults = () => {
    fetch(`url-to-api.com/api/${category}`)
      .then((response) => response.json())
      .then((results) => {
        setResults(results);
      });
  };

  return (
    <div>
      <CategoryTabs category={category} onChange={setCategory} />
      <div>Current Category ID: {category}</div>
      <button onClick={getResults}>Search</button>
      <div>{/* Do something with the reuslts */}</div>
    </div>
  );
};

export default App;
