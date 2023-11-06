import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from "react-router-dom"
import './BasicTable.css'
import axios from "axios";
import CanvasJSReact from '@canvasjs/react-charts';
import 'bootstrap';
import bootbox from 'bootbox';
import { Context } from "../src/App"

window.jQuery = $;
window.$ = $;

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function SpendAnalysis() {
  const location = useLocation();
  const [token2, setToken2] = useContext(Context)
  const acc_id = location.state.ccid;
  const [transaction, setTransaction] = useState({})
  const [yearData, setYearData] = useState()
  const [category, setCategory] = useState()
  const [month1Data, setMonth1Data] = useState()
  const [month2Data, setMonth2Data] = useState()
  const [month3Data, setMonth3Data] = useState()
  const [month4Data, setMonth4Data] = useState()
  const [month5Data, setMonth5Data] = useState()
  const [month6Data, setMonth6Data] = useState()
  const [month7Data, setMonth7Data] = useState()
  const [month8Data, setMonth8Data] = useState()
  const [month9Data, setMonth9Data] = useState()
  const [userInput, setUserInput] = useState({
    TimeFrame: "",
    Month: "",
    ChartType: "",
    ComparisonMonth: ""
  })
 
  function handleChange(event) {
    const { name, value } = event.target;
    setUserInput(prevInput => {
      return { ...prevInput, [name]: value };
    });
  }

  useEffect(() => {
    async function fetchData() {
      const transactions = await axios.post("/transactions/get", { access_token: token2 });
      setTransaction(transactions.data)
    }
    fetchData();
  }, []);

  useEffect(() => {
    let categories = [];
    let ccTransactions = []
    for (let i = 0; i < transaction.length; i++) {
      if (transaction[i].account_id === acc_id) {
        categories.push(transaction[i].personal_finance_category.primary)
        ccTransactions.push(transaction[i])
      }
    }
    const upperCategories = [...new Set(categories)]; 


    let finalCategories = upperCategories.map(label => ({ label, y: 0 }))
    setCategory(finalCategories)

    let finalYearData = finalCategories.map((prevCategory) => {
      let amount = 0;
      for (let i = 0; i < ccTransactions.length; i++) {
        if (ccTransactions[i].personal_finance_category.primary === prevCategory.label) {
          amount = amount + ccTransactions[i].amount;
        }
      }
      return { ...prevCategory, y: amount }
    })
    setYearData(finalYearData)

  }, [transaction])

  useEffect(() => {

    function months() {
      let ccTransactions = []
      for (let i = 0; i < transaction.length; i++) {
        if (transaction[i].account_id === acc_id) {
          ccTransactions.push(transaction[i])
        }
      }

      let month1Txn = [];
      let month2Txn = [];
      let month3Txn = [];
      let month4Txn = [];
      let month5Txn = [];
      let month6Txn = [];
      let month7Txn = [];
      let month8Txn = [];
      let month9Txn = [];

      for (let j = 0; j < ccTransactions.length; j++) {
        const cutDate = ccTransactions[j].date.substring(0, 7);
        if (cutDate === "2023-01") {
          month1Txn.push(ccTransactions[j])
        }
        else if (cutDate === "2023-02") {
          month2Txn.push(ccTransactions[j])
        }
        else if (cutDate === "2023-03") {
          month3Txn.push(ccTransactions[j])
        }
        else if (cutDate === "2023-04") {
          month4Txn.push(ccTransactions[j])
        }
        else if (cutDate === "2023-05") {
          month5Txn.push(ccTransactions[j])
        }
        else if (cutDate === "2023-06") {
          month6Txn.push(ccTransactions[j])
        }
        else if (cutDate === "2023-07") {
          month7Txn.push(ccTransactions[j])
        }
        else if (cutDate === "2023-08") {
          month8Txn.push(ccTransactions[j])
        }
        else if (cutDate === "2023-09") {
          month9Txn.push(ccTransactions[j])
        }
      }

      let finalmonth1Data = category.map(prevCategory => {
        let amount1 = 0
        for (let i = 0; i < month1Txn.length; i++) {
          if (month1Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount1 = amount1 + month1Txn[i].amount
          }
        }
        return { ...prevCategory, y: amount1 }
      })
      let month1Filtered = finalmonth1Data.filter(data => data.y !== 0)
      month1Filtered.length > 0 && setMonth1Data(month1Filtered)

      let finalmonth2Data = category.map(prevCategory => {
        let amount2 = 0
        for (let i = 0; i < month2Txn.length; i++) {
          if (month2Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount2 = amount2 + month2Txn[i].amount
          }
        }
        return { ...prevCategory, y: amount2 }
      })
      let month2Filtered = finalmonth2Data.filter(data => data.y !== 0)
      month2Filtered.length > 0 && setMonth2Data(month2Filtered)

      let finalmonth3Data = category.map(prevCategory => {
        let amount3 = 0
        for (let i = 0; i < month3Txn.length; i++) {
          if (month3Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount3 = amount3 + month3Txn[i].amount
          }
        }
        return { ...prevCategory, y: amount3 }
      })
      let month3Filtered = finalmonth3Data.filter(data => data.y !== 0)
      month3Filtered.length > 0 && setMonth3Data(month3Filtered)

      let finalmonth4Data = category.map(prevCategory => {
        let amount4 = 0
        for (let i = 0; i < month4Txn.length; i++) {
          if (month4Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount4 = amount4 + month4Txn[i].amount
          }
        }
        return { ...prevCategory, y: amount4 }

      })
      let month4Filtered = finalmonth4Data.filter(data => data.y !== 0)
      month4Filtered.length > 0 && setMonth4Data(month4Filtered)

      let finalmonth5Data = category.map(prevCategory => {
        let amount5 = 0
        for (let i = 0; i < month5Txn.length; i++) {
          if (month5Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount5 = amount5 + month5Txn[i].amount
          }

        }
        return { ...prevCategory, y: amount5 }
      })
      let month5Filtered = finalmonth5Data.filter(data => data.y !== 0)
      month5Filtered.length > 0 && setMonth5Data(month5Filtered)

      let finalmonth6Data = category.map(prevCategory => {
        let amount6 = 0
        for (let i = 0; i < month6Txn.length; i++) {
          if (month6Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount6 = amount6 + month6Txn[i].amount
          }

        }
        return { ...prevCategory, y: amount6 }
      })
      let month6Filtered = finalmonth6Data.filter(data => data.y !== 0)
      month6Filtered.length > 0 && setMonth6Data(month6Filtered)

      let finalmonth7Data = category.map(prevCategory => {
        let amount7 = 0
        for (let i = 0; i < month7Txn.length; i++) {
          if (month7Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount7 = amount7 + month7Txn[i].amount
          }
        }
        return { ...prevCategory, y: amount7 }
      })
      let month7Filtered = finalmonth7Data.filter(data => data.y !== 0)
      month7Filtered.length > 0 && setMonth7Data(month7Filtered)


      let finalmonth8Data = category.map(prevCategory => {
        let amount8 = 0
        for (let i = 0; i < month8Txn.length; i++) {
          if (month8Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount8 = amount8 + month8Txn[i].amount
          }
        }
        return { ...prevCategory, y: amount8 }
      })
      let month8Filtered = finalmonth8Data.filter(data => data.y !== 0)
      month8Filtered.length > 0 && setMonth8Data(month8Filtered)

      let finalmonth9Data = category.map(prevCategory => {
        let amount9 = 0
        for (let i = 0; i < month9Txn.length; i++) {
          if (month9Txn[i].personal_finance_category.primary === prevCategory.label) {
            amount9 = amount9 + month9Txn[i].amount
          }
        }
        return { ...prevCategory, y: amount9 }
      })
      let month9Filtered = finalmonth9Data.filter(data => data.y !== 0)
      month9Filtered.length > 0 && setMonth9Data(month9Filtered)
    }

    userInput.TimeFrame && months()

  }, [yearData, userInput.TimeFrame])

  const dataYear = {
    zoomEnabled: true,
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2",
    axisY: {
      title: "Amount",
      suffix: " USD"
    },
    title: {
      text: 'Spend Analysis - Past 1 Year'
    },
    data: [
      {
        type: `${userInput.ChartType}`,
        dataPoints: yearData,
        toolTipContent: "{y} USD"
      }
    ]
  }

  function selectMonths() {
    if (userInput.Month === "January") {
      return month1Data
    }
    else if (userInput.Month === "February") {
      return month2Data
    }
    else if (userInput.Month === "March") {
      return month3Data
    }
    else if (userInput.Month === "April") {
      return month4Data
    }
    else if (userInput.Month === "May") {
      return month5Data
    }
    else if (userInput.Month === "June") {
      return month6Data
    }
    else if (userInput.Month === "July") {
      return month7Data
    }
    else if (userInput.Month === "August") {
      return month8Data
    }
    else if (userInput.Month === "September") {
      return month9Data
    }

  }

  function selectComparisonMonths() {
    if (userInput.ComparisonMonth === "January") {
      return month1Data
    }
    else if (userInput.ComparisonMonth === "February") {
      return month2Data
    }
    else if (userInput.ComparisonMonth === "March") {
      return month3Data
    }
    else if (userInput.ComparisonMonth === "April") {
      return month4Data
    }
    else if (userInput.ComparisonMonth === "May") {
      return month5Data
    }
    else if (userInput.ComparisonMonth === "June") {
      return month6Data
    }
    else if (userInput.ComparisonMonth === "July") {
      return month7Data
    }
    else if (userInput.ComparisonMonth === "August") {
      return month8Data
    }
    else if (userInput.ComparisonMonth === "September") {
      return month9Data
    }

  }
  const dataMonths = {
    zoomEnabled: true,
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2",
    axisY: {
      title: "Amount",
      suffix: " USD"
    },
    title: {
      text: `Spend Analysis - ${userInput.Month}`
    },
    data: [
      {
        type: userInput.ChartType,
        dataPoints: selectMonths(),
        // dataPoints: month1Data,
        toolTipContent: "{y} USD"
      }
    ]
  }

  const dataComparisonMonths = {
    zoomEnabled: true,
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2",
    axisY: {
      title: "Amount",
      suffix: " USD",
   
    },
    
    title: {
      text: `Spend Analysis - ${userInput.Month} & ${userInput.ComparisonMonth}` 
    },
    data: [
      {
        type: userInput.ChartType,
        showInLegend: true,
        legendText: userInput.Month,
        dataPoints: selectMonths(),
        // dataPoints: month1Data,
        toolTipContent: "{y} USD"
      },
      {
        type: userInput.ChartType,
        showInLegend: true,
        legendText: userInput.ComparisonMonth,
        dataPoints: selectComparisonMonths(),
        toolTipContent: "{y} USD"
      }
    ]
  }

  function monthsSelection() {
    const months = [{ month: "January", label: 1 }, { month: "February", label: 2 }, { month: "March", label: 3 }
      , { month: "April", label: 4 }, { month: "May", label: 5 }, { month: "June", label: 6 }
      , { month: "July", label: 7 }, { month: "August", label: 8 }, { month: "September", label: 9 }
      , { month: "October", label: 10 }, { month: "November", label: 11 }, { month: "December", label: 12 }]

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    function alert() {
      bootbox.alert("Please select valid month from the Current Calendar Year")
    }

    function check1() {
      let selectedMonth = selectMonths()
      for (let i = 0; i < months.length; i++) {
        if (userInput.Month === months[i].month) {
          if (months[i].label <= currentMonth && userInput.Month) {
            return !selectedMonth && bootbox.alert("No Credit Card Transactions Done During This Month")
          }
        }
      }
    }

    check1();

    function check2() {
      let selectedMonth = selectComparisonMonths()
      for (let i = 0; i < months.length; i++) {
        if (userInput.ComparisonMonth === months[i].month) {
          if (months[i].label <= currentMonth) {
            return !selectedMonth && bootbox.alert("Sorry, cannot compare. No Credit Card Transactions Done During This Month")
          }
        }
      }
    }

    userInput.ComparisonMonth && check2();

    if (userInput.ComparisonMonth) {
      for (let j = 0; j < months.length; j++) {
        if (userInput.ComparisonMonth === months[j].month) {
          for (let i=0; i < months.length; i++) {
            if (userInput.Month === months [i].month) {
            return ((months[j].label <= currentMonth) && (months[i].label <= currentMonth ) ) ? (userInput.ChartType && <CanvasJSChart options={dataComparisonMonths} />) : alert();
            }
          }  
        }
      }
    }

    for (let i = 0; i < months.length; i++) {
      if (userInput.Month === months[i].month) {
        return months[i].label <= currentMonth ? (userInput.ChartType && <CanvasJSChart options={dataMonths} />) : alert();
      }
    }
  }

  function handleLogOut() {
    window.localStorage.clear();
    window.location.href = "./";
  }

  return (
    <>
      <div className="buttons-flex">
        <Link to='/accounts'><button type='button' className='btn btn-success'>Back to your accounts</button></Link>
        <button type='button' className='btn btn-success' onClick={handleLogOut}> Log Out </button>
      </div>
      <div className="spend-analysis-introduction">
        <h4 className="spend-analysis-introduction-heading">
          Welcome to the Spend Analysis (Credit Card).
        </h4>
        <p className="spend-analysis-introduction-text">
          This page helps you visualize your spending based on your transactions, which in turn helps you manage your money better.
          <br />
          You have 2 time-based options where you can visualize your spending based on time (Year and Month). However you can only view month wise for the current Calendar year.
          <br />
          You also have 4 options to visualize your spendings (Line Graph, Bar Graph, Pie Chart, Donut Chart).
        </p>
      </div>

      <div className="sa-dropdowns">
        <select
          type="text"
          id="dd-timeFrame"
          name="TimeFrame"
          onChange={handleChange}
          value={userInput.TimeFrame}
        >
          <option value="" disabled hidden defaultValue="Choose Time-Frame">Choose TimeFrame</option>
          <option value="Past 1 Year">Past 1 Year</option>
          <option value="Select By Month">Select By Month </option>
        </select>

        {userInput.TimeFrame === "Select By Month" && <select
          type="text"
          id="dd-Month"
          name="Month"
          onChange={handleChange}
          value={userInput.Month}
        >
          <option value="" disabled hidden defaultValue="Choose Month">Choose Month (2023)</option>
          <option value="January" hidden = {userInput.ComparisonMonth === 'January'} >January</option>
          <option value="February" hidden = {userInput.ComparisonMonth === 'February'}>February</option>
          <option value="March" hidden = {userInput.ComparisonMonth === 'March'}>March</option>
          <option value="April" hidden = {userInput.ComparisonMonth === 'April'}>April</option>
          <option value="May" hidden = {userInput.ComparisonMonth === 'May'}>May</option>
          <option value="June" hidden = {userInput.ComparisonMonth === 'June'}>June</option>
          <option value="July" hidden = {userInput.ComparisonMonth === 'July'}>July</option>
          <option value="August" hidden = {userInput.ComparisonMonth === 'August'}>August</option>
          <option value="September" hidden = {userInput.ComparisonMonth === 'September'}>September</option>
          <option value="October" hidden = {userInput.ComparisonMonth === 'October'}>October</option>
          <option value="November" hidden = {userInput.ComparisonMonth === 'November'}>November</option>
          <option value="December" hidden = {userInput.ComparisonMonth === 'December'}>December</option>
        </select>}

        {userInput.TimeFrame === "Select By Month" && <select
          type="text"
          id="dd-ComparisonMonth"
          name="ComparisonMonth"
          onChange={handleChange}
          value={userInput.ComparisonMonth}
        >
          <option value="" defaultValue="Choose Month">Compare With Month (Optional)</option>
          <option value="January" hidden = {userInput.Month === 'January'} >January</option>
          <option value="February" hidden = {userInput.Month === 'February'}>February</option>
          <option value="March" hidden = {userInput.Month === 'March'}>March</option>
          <option value="April" hidden = {userInput.Month === 'April'}>April</option>
          <option value="May" hidden = {userInput.Month === 'May'}>May</option>
          <option value="June" hidden = {userInput.Month === 'June'}>June</option>
          <option value="July" hidden = {userInput.Month === 'July'}>July</option>
          <option value="August" hidden = {userInput.Month === 'August'}>August</option>
          <option value="September" hidden = {userInput.Month === 'September'}>September</option>
          <option value="October" hidden = {userInput.Month === 'October'}>October</option>
          <option value="November" hidden = {userInput.Month === 'November'}>November</option>
          <option value="December" hidden = {userInput.Month === 'December'}>December</option>
        </select>}

        <select
          type="text"
          id="dd-ChartType"
          name="ChartType"
          onChange={handleChange}
          value={userInput.ChartType}
        >
          <option value='' disabled hidden defaultValue="Choose Chart Type">Choose Chart Type</option>
          <option value="line">Line Graph</option>
          <option value="column">Bar Graph</option>
          <option value="pie" hidden={userInput.TimeFrame === 'Select By Month' && userInput.ComparisonMonth}>Pie Chart</option>
          <option value="doughnut" hidden={userInput.TimeFrame === 'Select By Month' && userInput.ComparisonMonth}>Donut Chart</option>
        </select>
      </div>

      {(userInput.TimeFrame === "Past 1 Year" && userInput.ChartType) && <CanvasJSChart options={dataYear} />}
      {(userInput.TimeFrame === "Select By Month" && monthsSelection())}
      <div className="footer-welcomepage">
        <p className="trademark-welcomepage">© 2023 Pranav Ram Hariharan. All rights reserved. This is a work for my MSc Project.</p>
      </div>
    </>
  )
} 