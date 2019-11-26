import React from "react";
/* import Contador from './components/contador/contador'; */

import WidgetConverter from "./components/converter/WidgetConverter";
import WidgetTitle from "./components/converter/WidgetTitle";
import ConverterWrapper from "./components/converter/WidgetWrapper";
import "./css/main.css";

function App() {
  return (
    <WidgetConverter>
      <WidgetTitle title="Conversor de Divisas" />
      <ConverterWrapper />
    </WidgetConverter>

  );
}

export default App;
