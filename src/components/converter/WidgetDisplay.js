import React from "react";
import NumberFormat from "react-number-format";

const WidgetDisplay = props => {
  const { baseCurrency, quotedCurrency} = props.parity;
  const parity = props.parity;

  let splitDate = parity.date && new Date(parity.date.split("+")[0]);

  let newDate = new Date(splitDate);

  let options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
    hour: "numeric",
    minute: "2-digit"
  };

  let formatDate = newDate.toLocaleString([], options);

  let quotationOperation =
    props.typeOperation === "compra" ? parity.sell : parity.buy;

  return (
    <>
      <div className="display-peers">
        <NumberFormat
          value={`1 ${baseCurrency}`}
          displayType={"text"}
          suffix={` ${parity.quotedCurrency}`}
          thousandSeparator={"."}
          decimalSeparator={","}
          decimalScale={2}
        />
        {` = `}
        <NumberFormat
          value={quotationOperation}
          displayType={"text"}
          suffix={` ${parity.baseCurrency}`}
          thousandSeparator={"."}
          decimalSeparator={","}
          decimalScale={2}
        />
      </div>

      {/* <div className="display-quoted-prices"></div> */}

      <div className="display-quoted-date">
        <span>{`Valores del ${
          baseCurrency && quotedCurrency
            ? formatDate
            : "no hay monedas seleccionadas"
        }`}</span>
      </div>
    </>
  );
};

export default WidgetDisplay;
