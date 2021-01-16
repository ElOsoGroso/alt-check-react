import React from "react";

const Button = ({onChange, value, name }) => {
  return (
    <div>
      <input type="text" value={value} name={name} onChange={onChange} />
    </div>
  );
};

export default Button;
