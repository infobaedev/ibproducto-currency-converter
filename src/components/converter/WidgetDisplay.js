import React from "react";

const WidgetDisplay = props => {

  const { baseCurrency, quotedCurrency } = props.val;

  /* const { baseCurrencyAmount, quotedCurrencyAmount } = props.quantities; */

  let newDate = new Date(quotedCurrency.date);

  let formatDate = `${newDate.getDay()}/${newDate.getDate()}/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes() <= 0 ? newDate.getMinutes() + '0' : newDate.getMinutes() }`;

  return (
    <>
      <div className="display-peers">
        <span>
          {`1 ${baseCurrency && baseCurrency.quotedCurrency} = ${
            quotedCurrency.sell
          } ${quotedCurrency.quotedCurrency}`}
        </span>
      </div>

      {/* <div className="display-quoted-prices">
        <span>Compra: {baseCurrency && quotedCurrency.compra}</span>
        <span>Venta: {quotedCurrency && quotedCurrency.venta}</span>
      </div> */}

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
