import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import EmailIcon from '@mui/icons-material/Email';
import './BasicTable.css'
import { Link, useLocation } from 'react-router-dom';
import Calendar_Data from './Calendar_Data';
import $ from 'jquery';
import 'bootstrap';
import bootbox from 'bootbox';
import { Context } from "../src/App"


window.jQuery = $;
window.$ = $;

export default function Calendar() {
  const location = useLocation();
  const [token2, setToken2] = useContext(Context);
  const [transaction, setTransaction] = useState();
  const [value, setValue] = useState(new Date());
  const [currentDate, setCurrentDate] = useState();
  const [txnData, setTxnData] = useState(Calendar_Data)
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [isFunctExecuted, setIsFunctExecuted] = useState();

  useEffect(() => {
    console.log("effect in")
    async function fetchData() {
      const transactions = await axios.post("/transactions/get", { access_token: token2 });
      console.log("txn data", transactions.data);
      setTransaction(transactions.data);

    }
    fetchData();
  }, []);

  useEffect(() => {
    function mostFrequent(arr) {
      const frequencyMap = {};
      let maxElement = arr[0];
      let maxCount = 1;

      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (frequencyMap[element]) {
          frequencyMap[element]++
        }
        else {
          frequencyMap[element] = 1;
        }
        if (frequencyMap[element] > maxCount) {
          maxElement = element;
          maxCount = frequencyMap[element]
        }
      }
      return maxElement;
    }


    let loanArr = []
    let loanObj = {}
    if (transaction) {
      for (var i = 0; i < transaction.length; i++) {
        if (transaction[i].personal_finance_category.primary === "LOAN_PAYMENTS") {
          loanArr.push(transaction[i].date)
          loanObj = {
            ...loanObj,
            Amount: transaction[i].amount,
            Name: transaction[i].name,
            Category: transaction[i].personal_finance_category.detailed
          }
        }
      }
    }

    const loanArrDate = loanArr.map(date => +date.slice(-2))
    let finalLoanDate = mostFrequent(loanArrDate)

    let finalLoanObj = { Date: finalLoanDate, ...loanObj }


    let rentArr = []
    let rentObj = {}
    if (transaction) {
      for (var i = 0; i < transaction.length; i++) {
        if (transaction[i].personal_finance_category.primary === "RENT_AND_UTILITIES" && transaction[i].name === "AUTOMATIC PAYMENT - THANK") {
          rentArr.push(transaction[i].date)
          rentObj = {
            ...rentObj,
            Amount: transaction[i].amount,
            Name: transaction[i].name,
            Category: transaction[i].personal_finance_category.detailed
          }
        }
      }
    }

    const rentArrDate = rentArr.map(date => +date.slice(-2))
    let finalRentDate = mostFrequent(rentArrDate)

    let finalRentObj = { Date: finalRentDate, ...rentObj }

    setHighlightedDays([finalLoanDate, finalRentDate])

    var date = new Date(value)
    var day = date.getDate();
    setCurrentDate(day)

    setTxnData(data => {
      return (data.map((dateinfo) => {
        if (dateinfo.Date === finalLoanObj.Date) {
          return { ...dateinfo, Description: `You are likely to be debited ${finalLoanObj.Amount} USD on this day for ${finalLoanObj.Category.toLowerCase()}.` };
        } else if (dateinfo.Date === finalRentObj.Date) {
          return { ...dateinfo, Description: `You are likely to be debited ${finalRentObj.Amount} USD on this day for ${finalRentObj.Category.toLowerCase()}.` };
        } else {
          return dateinfo;
        }
      }))
    });
  }, [transaction, value])

  function CheckDay(day) {
    if (day.getMonth() === 1) {
      let tempDays = highlightedDays.map(date => {
        if (date > 28) {
          return date = 28;
        }
        else return date
      })

      if (day.getDay() > 0 && day.getDay() <= 5) {
        if ((tempDays.indexOf(day.getDate()) >= 0)) {
          return true
        }
      }
      if (day.getDay() === 5) {
        if ((tempDays.indexOf(day.getDate() + 1) >= 0)) {
          return true
        }
        else if ((tempDays.indexOf(day.getDate() + 2) >= 0)) {
          return true
        }
      }
    }
    else {
      if (day.getDay() > 0 && day.getDay() <= 5) {
        if ((highlightedDays.indexOf(day.getDate()) >= 0)) {
          return true
        }
      }
      if (day.getDay() === 5) {
        if ((highlightedDays.indexOf(day.getDate() + 1) >= 0)) {
          return true
        }
        else if ((highlightedDays.indexOf(day.getDate() + 2) >= 0)) {
          return true
        }
      }
    }
  }

  function handleClick() {
    bootbox.alert("Hi! You have a financial event on this Day or in the next two days. Click on the date to see the exact details")
  }

  function handleLogOut() {
    window.localStorage.clear();
    window.location.href = "./";
  }

  return (
    <div className='calendar-container'>
      <div className="buttons-flex-txn">
        <Link to='/accounts'><button type='button' className='backbutton-calendarpage'>Back to your accounts</button></Link>
        <Link to="/"><button type='button' className='logout-calendarpage' onClick={handleLogOut}> Log Out </button></Link>
      </div>
      {/* <h1 className='calendar-header'> Calendar</h1>  */}

      <div className="calendar-intro">
        <h2 className='calendar-header'>Welcome to the Financial Calendar!</h2>
        <p className='calendar-details'>Discover important financial events marked with badges on specific dates. Badges represent most likely debit dates, adjusted for weekdays.</p>
        <p className='calendar-details'>Click on the day to see event details.</p>
      </div>
      <div className='calendar - flex'>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            // mask='____/__/__'
            variant='static'
            orientation='portrait'
            value={value}
            onChange={(newValue) => setValue(newValue)}
            renderInput={(params) => {
              <TextField {...params} />;
            }}
            renderDay={(day, _value, DayComponentProps) => {
              const isSelected = !DayComponentProps.outsideCurrentMonth && CheckDay(day)

              return (
                <Badge
                  key={day.toString()}
                  overlap='circular'
                  badgeContent={isSelected ? <EmailIcon onClick={handleClick} className="calendar-badge" color='red' /> : undefined}
                >
                  <PickersDay {...DayComponentProps} />
                </Badge>
              );
            }}
          />
        </LocalizationProvider>
      </div>
      <div className='calendar-description'>
        <h2 className='calendar-event-header'> Financial Event of the day</h2>
        <p className='calendar-event-description'>{transaction && txnData[currentDate - 1].Description}</p>
      </div>
      <div className="footer-welcomepage">
        <p className="trademark-welcomepage">© 2023 Pranav Ram Hariharan. All rights reserved. This is a work for my MSc Project.</p>
      </div>
    </div>
  );
};