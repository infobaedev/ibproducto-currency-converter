import React from "react";
import WidgetConverter from "./components/converter/WidgetConverter";
import ConverterWrapper from "./components/converter/WidgetWrapper";
import "./css/main.css";

function App() {
  return (
    <WidgetConverter>
      <ConverterWrapper />
    </WidgetConverter>

  );
}

export default App;
