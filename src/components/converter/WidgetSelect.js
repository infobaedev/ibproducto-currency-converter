import React from "react";

const Select = props => {
  
  function handleChange(event) {
    props.onChange(event);
  }

  return (
    <div className="widget-select">      
      <select onChange={handleChange} value={props.selectedCurrency.symbol} >
        
        {props.currency.map(item => {
          return (
            <option key={item.symbol} value={item.symbol}>
              {item.quotedCurrencyName}
            </option>
          );
        })}

      </select>
    </div>
  );
};

export default Select;
