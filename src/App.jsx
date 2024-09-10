import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [valorCompra, setValorCompra] = useState('');
  const [parcelamentos, setParcelamentos] = useState([]);
  const [numeroParcelas, setNumeroParcelas] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('');
  const [valorParcela, setValorParcela] = useState('');
  const [valorTotal, setValorTotal] = useState('');

  useEffect(() => {
    fetch('/parcelamentos.json')  // Corrigido para o caminho correto
      .then((response) => response.json())
      .then((data) => setParcelamentos(data.parcelamentos));
  }, []);

  useEffect(() => {
    const selectedOption = parcelamentos.find(
      (item) => item.valor_compra == valorCompra && item.numero_parcelas == numeroParcelas
    );

    if (selectedOption) {
      setTaxaJuros(selectedOption.taxa_juros_mensal);
    } else {
      setTaxaJuros('');
    }

    if (valorCompra && numeroParcelas && selectedOption) {
      const juros = selectedOption.taxa_juros_mensal / 100;
      const valorParcelaCalc = (valorCompra * juros * Math.pow(1 + juros, numeroParcelas)) / (Math.pow(1 + juros, numeroParcelas) - 1);
      const valorTotalCalc = valorParcelaCalc * numeroParcelas;
      setValorParcela(valorParcelaCalc.toFixed(2));
      setValorTotal(valorTotalCalc.toFixed(2));
    } else {
      setValorParcela('');
      setValorTotal('');
    }
  }, [valorCompra, numeroParcelas, parcelamentos]);

  return (
    <div className="App">
      <h1>Simulador de Parcelamento</h1>
      <label>
        Valor Total da Compra:
        <input 
          type="number" 
          value={valorCompra} 
          onChange={(e) => setValorCompra(e.target.value)} 
          placeholder="Digite o valor da compra" 
        />
      </label>
      <p>Digite um dos valores sugeridos (R$1000, R$500, R$1500, R$200, R$2500) para simular o parcelamento.</p>
      <label>
        Número de Parcelas:
        <select value={numeroParcelas} onChange={(e) => setNumeroParcelas(e.target.value)}>
          <option value="">Selecione</option>
          {parcelamentos
            .filter((item) => item.valor_compra == valorCompra)
            .map((item, index) => (
              <option key={index} value={item.numero_parcelas}>
                {item.numero_parcelas} parcelas
              </option>
            ))}
        </select>
      </label>
      {valorParcela && valorTotal && (
        <div>
          <h2>Resultado da Simulação</h2>
          <p>
            Com um valor de compra de R${valorCompra} parcelado em {numeroParcelas} vezes com uma taxa de juros de {taxaJuros}% ao mês, cada parcela será de R${valorParcela}, e o valor total a ser pago será de R${valorTotal}.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
