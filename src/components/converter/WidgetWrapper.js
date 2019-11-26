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
  const QUOTED_CURRENCY_INIT = "DLRSUPV";
  let updatedCalculation;

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "http://10.0.100.91:8094/api/divisas/cotizaciones"
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



  function matchInitValues(currencyArray, initValue) {
    return currencyArray.length > 0
      ? currencyArray.find(curr => curr.symbol === initValue)
      : null;
  }

  /* Lista de divisas base */
  const baseCurrencysList = currency.filter(
    i => i.quotedCurrency === "ARS" || i.quotedCurrency === "USD"
  );
  const quotedCurrencysList = currency.filter(
    i => i.baseCurrency === baseCurrency.quotedCurrency
  );

  /* EVENTO filtrar opcion de divisa base */
  function handleChangeBaseCurrency(event) {
    console.log("Filter base currency")
    setBaseCurrency(currency.find(coin => coin.symbol === event.target.value));
    /*setQuotedCurrency(currency.filter(
      i => i.baseCurrency === baseCurrency.quotedCurrency
    )[0])*/
  }

  /* EVENTO filtrar opcion de divisa contraparte */
  function handleChangeQuotedCurrency(event) {
    console.log("Filter quoted currency");
    setQuotedCurrency(
      currency.find(coin => coin.symbol === event.target.value)
    );
  }

  /* EVENTO CAMBIO importe divisa contraparte */
  function handleChangeAmount(event) {
    let amount = event.target.value;
    setQuotedCurrencyAmount(amount);
  }

  /* actualizacion monto a operar */
  function calculationUpdater(type) {
    let operation =
      type === "compra" ? quotedCurrency.sell : quotedCurrency.buy;

    const pairCalculation = quotedCurrencyAmount * operation;

    updatedCalculation = pairCalculation/* .toFixed(2) */;

    console.log(updatedCalculation, typeOperation);
  }

  calculationUpdater(typeOperation);

  if (currency.length === 0) {
    return <>Loading</>;
  }

  return (
    <div className="widget-wrapper">
      <div className="widget-selects">
        <WidgetSelect
          currency={baseCurrencysList}
          onChange={handleChangeBaseCurrency}
          selectedCurrency={baseCurrency}
        />

        <WidgetSelect
          currency={quotedCurrencysList}
          onChange={handleChangeQuotedCurrency}
          selectedCurrency={quotedCurrency}
        />
      </div>

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
        <WidgetDisplay val={{ baseCurrency, quotedCurrency }} />
      </div>

      <div className="widget-inputs">
        <div className="input-group">
          <label className="input-label">{`${quotedCurrency.quotedCurrencyName} a comprar`}</label>
          {/* <input
            className="input"
            type="number"
            name="quotedCurrencyAmount"
            value={quotedCurrencyAmount}
            onChange={handleChangeAmount}
          /> */}

          <NumberFormat
            className="input"
            value={quotedCurrencyAmount}
            onChange={handleChangeAmount}
            displayType={"input"}
            thousandSeparator={"."}
            decimalSeparator={","}
            fixedDecimalScale={true}
          />
        </div>

        <div className="input-group">
          <label className="input-label disabled">{`${baseCurrency.quotedCurrencyName} a pagar`}</label>
          {/* <input
            className="input disabled"
            type="number"
            name="base"
            value={updatedCalculation}
            disabled
          /> */}

          <NumberFormat
            className="input disabled"
            value={updatedCalculation}
            displayType={"input"}
            thousandSeparator={"."}
            decimalSeparator={","}
            fixedDecimalScale={true}
            decimalScale={2}
            disabled
          />
        </div>
      </div>

      <div className="widget-resume">
        <span className="resume-message">
          <span>
            Para comprar{" "}
            <NumberFormat
              value={quotedCurrencyAmount}
              displayType={"text"}
              thousandSeparator={"."}
              decimalSeparator={","}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={` ${quotedCurrency.quotedCurrency}`}
              className="prominent"
            />{" "}
            se necesitan{" "}
            <NumberFormat
              value={updatedCalculation}
              displayType={"text"}
              thousandSeparator={"."}
              decimalSeparator={","}
              decimalScale={2}
              fixedDecimalScale={true}
              suffix={` ${baseCurrency.quotedCurrency}`}
              className="prominent"
            />
          </span>
        </span>
      </div>

      <div className="widget-success">
        <span>Hay Errores: {JSON.stringify(hasError)}</span>
      </div>
    </div>
  );
}

export default ConverterWrapper;
