import React from "react";
import NumberFormat from "react-number-format";

const WidgetDisplay = props => {
  const { baseCurrency, quotedCurrency, typeOperation } = props.val;

  let splitDate =
    quotedCurrency.date && new Date(quotedCurrency.date.split("+")[0]);

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
    typeOperation === "compra" ? quotedCurrency.sell : quotedCurrency.buy;

  return (
    <>
      <div className="display-peers">
        <NumberFormat
          className=""
          value={`1 ${baseCurrency}`}
          displayType={"text"}
          suffix={` ${quotedCurrency.quotedCurrency}`}
          thousandSeparator={"."}
          decimalSeparator={","}
          decimalScale={2}
        />
        {` = `}
        <NumberFormat
          className=""
          value={quotationOperation}
          displayType={"text"}
          suffix={` ${baseCurrency.quotedCurrency}`}
          thousandSeparator={"."}
          decimalSeparator={","}
          decimalScale={2}
        />
      </div>

      {/* <div className="display-quoted-prices"></div> */}
      <div className="display-tax-info">Incluye el impuesto del 30%</div>
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
