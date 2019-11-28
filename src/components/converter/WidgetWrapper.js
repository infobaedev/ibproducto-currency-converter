import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import WidgetSelect from "./WidgetSelect";
import WidgetDisplay from "./WidgetDisplay";

function ConverterWrapper() {
  const [hasError, setErrors] = useState(false);
  const [currency, setCurrency] = useState([]);

  /* ESTADO inicial de base */
  const [baseCurrency, setBaseCurrency] = useState({});

  /* ESTADO inicial de contaparte */
  const [quotedCurrency, setQuotedCurrency] = useState({});

  /* ESTADO tipo de operación */
  const [typeOperation, setTypeOperation] = useState("compra");

  /* ESTADO montos a cotizar */
  const [quotedCurrencyAmount, setQuotedCurrencyAmount] = useState(1);

  const BASE_CURRENCY_INIT = "USDARS";
  const QUOTED_CURRENCY_INIT = "DLRBILL";
  let updatedCalculation;

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://dlj9yugrk8euh.cloudfront.net/api/divisas/cotizaciones/"
      );
      res
        .json()
        .then(function(response) {
          setCurrency(response);
          setBaseCurrency(matchInitValues(response, BASE_CURRENCY_INIT));
          setQuotedCurrency(matchInitValues(response, QUOTED_CURRENCY_INIT));
        })
        .catch(err => setErrors(err));
    }

    fetchData();
  }, []);

  console.log(`Errors: ${JSON.stringify(hasError)}`);

  function matchInitValues(currencyArray, initValue) {
    return currencyArray.length > 0
      ? currencyArray.find(curr => curr.symbol === initValue)
      : null;
  }

  /* Lista de divisas base */
  /* const baseCurrencysList = currency.filter(
    i => i.quotedCurrency === "ARS" || i.quotedCurrency === "USD"
  ); */

  const quotedCurrencysList = currency.filter(
    i => i.baseCurrency === baseCurrency.quotedCurrency
  );

  /* EVENTO filtrar opcion de divisa base */
  /* function handleChangeBaseCurrency(event) {
    console.log("Filter base currency");
    setBaseCurrency(currency.find(coin => coin.symbol === event.target.value));
  } */

  /* EVENTO filtrar opcion de divisa contraparte */
  function handleChangeQuotedCurrency(event) {
    setQuotedCurrency(
      currency.find(coin => coin.symbol === event.target.value)
    );
  }

  /* EVENTO CAMBIO importe divisa contraparte */
  function handleChangeAmount(values) {
    /* const {value} = values; */
    setQuotedCurrencyAmount(values.floatValue);
  }

  /* actualizacion monto a operar */
  function calculationUpdater(type) {
    let operation =
      type === "compra" ? quotedCurrency.sell : quotedCurrency.buy;

    const pairCalculation = quotedCurrencyAmount * operation;

    updatedCalculation = isNaN(pairCalculation) ? "-" : pairCalculation;
  }

  calculationUpdater(typeOperation);

  if (currency.length === 0) {
    return <>Loading</>;
  }

  return (
    <div className="widget-wrapper">
      <div className="widget-selects">
        {/* <WidgetSelect
          currency={baseCurrencysList}
          onChange={handleChangeBaseCurrency}
          selectedCurrency={baseCurrency}
        /> */}

        <div className="widget-select">
          <span className="disabled-option">{`${baseCurrency.quotedCurrencyName} a:`}</span>
        </div>

        <WidgetSelect
          currency={quotedCurrencysList}
          onChange={handleChangeQuotedCurrency}
          selectedCurrency={quotedCurrency}
        />
      </div>

      <div className="background-wrapper">
        <div className="widget-type-operation">
          <button
            className={`type-operation-button ${
              typeOperation === "compra" ? "active" : ""
            }`}
            onClick={() => setTypeOperation("compra")}
          >
            Comprar {baseCurrency && baseCurrency.divisa}
          </button>

          <button
            className={`type-operation-button ${
              typeOperation === "venta" ? "active" : ""
            }`}
            onClick={() => setTypeOperation("venta")}
          >
            Vender {baseCurrency && baseCurrency.divisa}
          </button>
        </div>

        <div className="widget-display">
          <WidgetDisplay
            val={{ baseCurrency, quotedCurrency, typeOperation }}
          />
        </div>

        <div className="widget-inputs">
          <div className="input-group">
            <label className="input-label">{`${
              quotedCurrency.quotedCurrencyName
            } a ${typeOperation === "compra" ? "comprar" : "vender"}`}</label>
            <NumberFormat
              className="input"
              value={quotedCurrencyAmount}
              onValueChange={handleChangeAmount}
              displayType={"input"}
              thousandSeparator={"."}
              decimalSeparator={","}
              maxLength="12"
            />
          </div>

          <div className="input-group">
            <label className="input-label disabled">{`${
              baseCurrency.quotedCurrencyName
            } a  ${typeOperation === "compra" ? "pagar" : "obtener"}`}</label>
            <NumberFormat
              className="input disabled"
              value={updatedCalculation}
              displayType={"input"}
              thousandSeparator={"."}
              decimalSeparator={","}
              decimalScale={2}
              disabled
            />
          </div>
        </div>

        <div className="widget-resume">
          <span className="resume-message">

            
              <span>
              {typeOperation === 'compra' ? 'Para comprar' : 'Vendiendo'}{" "}
              <NumberFormat
                className="prominent"
                value={quotedCurrencyAmount}
                displayType={"text"}
                suffix={` ${quotedCurrency.quotedCurrency}`}
                thousandSeparator={"."}
                decimalSeparator={","}
                decimalScale={2}
              />{" "}
              {typeOperation === 'compra' ? 'se necesitan' : 'se obtienen'}{" "}
              <NumberFormat
                className="prominent"
                value={updatedCalculation}
                displayType={"text"}
                suffix={` ${baseCurrency.quotedCurrency}`}
                thousandSeparator={"."}
                decimalSeparator={","}
                decimalScale={2}
              />
            </span>
          </span>
        </div>
      </div>

      {/* <div className="widget-success">
        <span>Hay Errores: {JSON.stringify(hasError)}</span>
      </div> */}
    </div>
  );
}

export default ConverterWrapper;
