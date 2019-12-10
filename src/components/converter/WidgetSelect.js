import React from "react";

const Select = props => {
  
  function handleChange(event) {
    props.onChange(event);
  }

  return (
    <div className="widget-select">      
      <select onChange={handleChange} value={props.selectedCurrency}>
        
        {props.options.map(item => {
          return (
            <option key={item.currency} value={item.currency}>
              {item.name}
            </option>
          );
        })}

      </select>
    </div>
  );
};

export default Select;
