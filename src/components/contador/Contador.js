import React, { useState } from 'react';

function Contador() {
    const [contador, setContador] = useState(0)
  
    return(
      <div>
          <span>El contador esta a {contador}</span>
          <button onClick={() => setContador(contador + 1)}>
            Incrementar
          </button>
          <button onClick={() => setContador(contador - 1)}>
            Decrementar
          </button>
      </div>
    )
  }

  export default Contador;