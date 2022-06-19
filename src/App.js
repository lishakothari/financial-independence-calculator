import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {

  const initialRetirementAge = Number(localStorage.getItem("retirementAge") || 65) ;
  const initialTargetRetirementAmount = Number(localStorage.getItem("targetRetirementAmt") || 0) ;
  const initialAnnualRetirementExpense = Number(localStorage.getItem("retirementExpense") || 0) ;
  const initialCurrentAge = Number(localStorage.getItem("currentAge") || 18) ;
  const initialCurrentSavings = Number(localStorage.getItem("currentSavings") || 2000) ;
  const initialContributions = Number(localStorage.getItem("contributions") || 500) ;
  const initialContributionFrequency = Number(localStorage.getItem("contributionFrequency") || "Annually") ;
  const initialPreRetirementROR = Number(localStorage.getItem("preRetirementROR") || 7) ;
  const initialPostRetirementROR = Number(localStorage.getItem("postRetirementROR") || 7) ;
  const initialInflationRate = Number(localStorage.getItem("inflationRate") || 3 ) ;

  const [retirementAge, setRetirementAge] = useState(initialRetirementAge);
  const [targetRetirementAmt, setTargetRetirementAmt] = useState(initialTargetRetirementAmount);
  const [retirementExpense, setRetirementExpense] = useState(initialAnnualRetirementExpense);
  const [currentAge, setCurrentAge] = useState(initialCurrentAge);
  const [currentSavings, setCurrentSavings] = useState(initialCurrentSavings);
  const [contributions, setContributions] = useState(initialContributions);
  const [contributionFrequency, setContributionFrequency] = useState(initialContributionFrequency);
  const [preRetirementROR, setPreRetirementROR] = useState(initialPreRetirementROR);
  const [postRetirementROR, setPostRetirementROR] = useState(initialPostRetirementROR);
  const [inflationRate, setInflationRate] = useState(initialInflationRate);

  const formatter = new Intl.NumberFormat("en-US", { 
    style:"currency", 
    currency:"INR", 
    minimumFractionDigits: 2
  });

  const calculateRetirementAge = (newTargetRetirementAmount) => {
    const netPreRetirementROR = ( preRetirementROR - inflationRate)/100;
    let currentBalance = currentSavings;
    const annualContributions = contributionFrequency === "Annually" ? contributions : contributions * 12;
    let RetirementAge = currentAge;

    while(currentBalance < newTargetRetirementAmount) {
      currentBalance = annualContributions + currentBalance * (1 + netPreRetirementROR);
      RetirementAge +=1;

      if (RetirementAge > 70) break;
    }

    return RetirementAge;
  };

  useEffect (() => {
    localStorage.setItem("retirementAge", retirementAge );
    localStorage.setItem("targetRetirementAmt", targetRetirementAmt );
    localStorage.setItem("retirementExpense", retirementExpense );
    localStorage.setItem("currentAge", currentAge );
    localStorage.setItem("currentSavings", currentSavings );
    localStorage.setItem("contributions", contributions );
    localStorage.setItem("contributionFrequency", contributionFrequency );
    localStorage.setItem("preRetirementROR", preRetirementROR );
    localStorage.setItem("postRetirementROR", postRetirementROR );
    localStorage.setItem("inflationRate", inflationRate );

    // Annual Retirement Expense < = Target Retirement Amount * Net Rate of Return
    let netPostRetirementROR = (postRetirementROR - inflationRate)/100;
    let newTargetRetirementAmount = (retirementExpense / netPostRetirementROR);

    setTargetRetirementAmt(newTargetRetirementAmount);

    const RetirementAge= calculateRetirementAge(newTargetRetirementAmount);
    setRetirementAge(RetirementAge);

  }, [
      retirementExpense, 
      currentAge, 
      currentSavings, 
      contributions, 
      contributionFrequency, 
      preRetirementROR, 
      postRetirementROR, 
      inflationRate 
    ]);


  return (
    <div className='App'>
      <h1> Financial Independence Calculator </h1>
      <h2> You can retire at age - {retirementAge} </h2>
      <h3> Target retirement amount - {formatter.format(targetRetirementAmt)} </h3>
      <form className='calculator-form'>
        <label> Annual retirement expenses
          <input 
            type="number" 
            value={retirementExpense}
            onChange = {(e) => setRetirementExpense(parseInt(e.target.value) || 0)}
          />
        </label>

        <label> Current Age
          <input 
            type="number" 
            value={currentAge}
            onChange = {(e) => setCurrentAge(parseInt(e.target.value) || 0)}
          />
        </label>

        <label> Current Savings Balance
          <input 
            type="number" 
            value={currentSavings}
            onChange = {(e) => setCurrentSavings(parseInt(e.target.value) || 0)}
          />
        </label>

        <label> Regular Contributions
          <input 
            type="number" 
            value={contributions}
            onChange = {(e) => setContributions(parseInt(e.target.value) || 0)}
          />
        </label>

        <label> Contribution Frequency 
          <select>
            <option value={contributionFrequency} onChange = {(e) => setContributionFrequency(parseInt(e.target.value))}> Monthly </option>
            <option value={contributionFrequency} onChange = {(e) => setContributionFrequency(parseInt(e.target.value))}> Annually </option>
          </select>
        </label>

        <div className='calculator-form'>
          <h2> Future </h2>

          <label> Pre-retirement rate of return
            <input 
              type="number" 
              value={preRetirementROR}
              onChange = {(e) => setPreRetirementROR(parseInt(e.target.value) || 0)}
            />
          </label>

          <label> Post-retirement rate of return
            <input 
              type="number" 
              value={postRetirementROR}
              onChange = {(e) => setPostRetirementROR(parseInt(e.target.value) || 0)}
            />
          </label>

          <label> Inflation
            <input 
              type="number" 
              value={inflationRate}
              onChange = {(e) => setInflationRate(parseInt(e.target.value) || 0)}
            />
          </label>
        </div>
    
      </form>
    </div>
  );
}

export default App;
