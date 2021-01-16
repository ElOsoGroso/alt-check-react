import React from "react";

const TextBox = ({onChange, value, name }) => {
  return (
      <input type="text" class = "text-box" value={value} name={name} onChange={onChange} />
  );
};

export default TextBox;
