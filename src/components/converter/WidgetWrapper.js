import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import WidgetSelect from "./WidgetSelect";
import WidgetDisplay from "./WidgetDisplay";
import Loading from "./Loading";
import {loadCurrencys} from '../../api'


function ConverterWrapper() {
  const [currencys, setCurrencys] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState("ARS");
  const [quotedCurrency, setQuotedCurrency] = useState("USD");
  const [typeOperation, setTypeOperation] = useState("compra");
  const [quotedCurrencyAmount, setQuotedCurrencyAmount] = useState(1);

  useEffect(() => {
    async function fetchData() {
      await loadCurrencys(setCurrencys).then(result =>{
        setCurrencys(result);
      }).catch(err => console.log(err));
    }
    fetchData();
  }, []);


  const baseCurrencys = createUniqueCurrencyArray(
    currencys.map(currency =>({ currency: currency.baseCurrency, name: currency.baseCurrencyName}))
  );


  const quotedCurrencys = createUniqueCurrencyArray(
    currencys
      .filter(curr => curr.baseCurrency === baseCurrency)
      .map(currency => ({
        currency: currency.quotedCurrency,
        name: currency.quotedCurrencyName
      }))
  );

  let parity = currencys.find(
    currency =>
      currency.baseCurrency === baseCurrency &&
      currency.quotedCurrency === quotedCurrency
  );

  //Si no hay paridad, usar el primer indice de los quotedCurrencys
  if(parity === undefined){
    parity = currencys.find(
    currency =>
      currency.baseCurrency === baseCurrency &&
      currency.quotedCurrency === quotedCurrencys[0].currency
    );
  }

  function createUniqueCurrencyArray(currencysParam) {
    let arrayToReturn = [];
    currencysParam.map(curr =>
      arrayToReturn.find(bCurr => bCurr.currency === curr.currency) ===
      undefined
        ? arrayToReturn.push(curr)
        : null
    );
    return arrayToReturn;
  }

  function calculate(){
    let valueQuotedCurrency =
      typeOperation === "compra" ? parity.sell : parity.buy;
    let pairCalculation = quotedCurrencyAmount * valueQuotedCurrency;
    return isNaN(pairCalculation) ? "-" : pairCalculation;
  }

  function handleChangeBaseCurrency(event) {
    setBaseCurrency(event.target.value);
  }

  function handleChangeQuotedCurrency(event) {
    setQuotedCurrency(event.target.value);
  }

  function handleChangeAmount(values) {
    setQuotedCurrencyAmount(values.floatValue);
  }


  if (currencys.length === 0) {
    return <Loading/>;
  }

  return (
    <div className="widget-wrapper">
      <div className="widget-selects">
        <div className="widget-select">
          <WidgetSelect
            options={baseCurrencys}
            onChange={handleChangeBaseCurrency}
            selectedCurrency={baseCurrency}
          />
        </div>

        <WidgetSelect
          options={quotedCurrencys}
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
          <WidgetDisplay parity={parity} typeOperation={typeOperation} />
        </div>

        <div className="widget-inputs">
          <div className="input-group">
            <label className="input-label">
              {`${quotedCurrency} a ${
                typeOperation === "compra" ? "comprar" : "vender"
              }`}
            </label>
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
            <label className="input-label disabled">
              {`${baseCurrency} 
            a  ${typeOperation === "compra" ? "pagar" : "obtener"}`}
            </label>

            <NumberFormat
              className="input disabled"
              value={calculate()}
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
              {typeOperation === "compra" ? "Para comprar" : "Vendiendo"}
              <NumberFormat
                className="prominent"
                value={quotedCurrencyAmount}
                displayType={"text"}
                suffix={`${quotedCurrency}`}
                thousandSeparator={"."}
                decimalSeparator={","}
                decimalScale={2}
              />{" "}
              {typeOperation === "compra" ? "se necesitan" : "se obtienen"}
              <NumberFormat
                className="prominent"
                value={calculate()}
                displayType={"text"}
                suffix={` ${baseCurrency}`}
                thousandSeparator={"."}
                decimalSeparator={","}
                decimalScale={2}
              />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ConverterWrapper;
