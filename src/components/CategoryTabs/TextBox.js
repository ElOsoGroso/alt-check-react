import React from "react";

const TextBox = ({onKeyDown,onChange, value, name }) => {
  return (
      <input type="text" class = "text-box" 
      onKeyDown={onKeyDown}
      value={value} 
      name={name} 
      onChange={onChange} />
  );
};

export default TextBox;
