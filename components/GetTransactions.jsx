import { useEffect, useState, useMemo, useContext } from 'react'
import React from 'react'
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { useTable, usePagination } from 'react-table'
import './BasicTable.css'
import { useLocation, Link } from 'react-router-dom'
import { Context } from '../src/App'
import logo2 from "../src/logo2.jpg"

export default function GetTransactions() {
  const [transaction, setTransaction] = useState();
  const [token2, setToken2] = useContext(Context)
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      const transactions = await axios.post("/transactions/get", { access_token: token2 });
      setTransaction(transactions.data);
    }

    fetchData();
  }, []);

  let tableTxn = []
  if (transaction) {
    for (var i = 0; i < transaction.length; i++) {
      if (location.state.accessor === transaction[i].account_id) {
        //console.log(transaction[i])
        tableTxn.push(transaction[i])
      }
    }
  }
  console.log(tableTxn)
  //console.log(tableTxn)
  // setTable(tableTxn)

  const COLUMNS = [
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Currency', accessor: 'iso_currency_code' },
    { Header: 'Date', accessor: 'date' },
    { Header: 'Description', accessor: 'name' },
    { Header: 'Category', accessor: 'personal_finance_category.primary' }
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => tableTxn || [], [transaction]);
  const tableInstance = useTable({
    columns,
    data,
  }, usePagination);

  const { getTableProps, getTableBodyProps, headerGroups,
    page, nextPage, previousPage,
    canPreviousPage, canNextPage, pageOptions, state, setPageSize, prepareRow } = tableInstance;

  const { pageIndex, pageSize } = state

  function handleLogOut() {
    window.localStorage.clear();
    window.location.href = "./";
  }
  if (!transaction) {
    return <div className='loading-container'>
      <div class="spinner-grow text-warning" role="status">
        <span class="sr-only"></span>
      </div>
      <div class="spinner-grow text-info" role="status">
        <span class="sr-only"></span>
      </div>
      <div class="spinner-grow text-danger" role="status">
        <span class="sr-only"></span>
      </div>
      <div class="spinner-grow text-dark" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
      ;
  }
  return (
    <div className='txn-container'>
      <div className="buttons-flex">
        <Link to='/accounts'><button type='button' className='btn btn-success'>Back to your accounts</button></Link>
        <button type='button' className='btn btn-success' onClick={handleLogOut}> Log Out </button>
      </div>
      {data.length > 0 ?
        <div>
          <div className='txn-heading'>
          <img src={logo2} alt="App Logo" className="logo2-txnpage" />
          <h3 className="transaction-heading">Your Transactions</h3>
          </div>
          <table {...getTableProps()}>
            <thead>
              {headerGroups?.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
              <tr></tr>
            </thead>
            <tbody {...getTableBodyProps()}>
              {page?.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className='table-pagination-footer'>
            <span> Page {' '} <strong> {pageIndex + 1} of {pageOptions.length} </strong>{' '}</span>
            <select className='dd-table' value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
              <option key='10' value='10'> Show 10 Transactions </option>
              <option key='15' value='15'> Show 15 Transactions </option>
              <option key='20' value='20'> Show 20 Transactions </option>
            </select>
            <button type='button' className='btn btn-success prevButton' onClick={() => previousPage()} disabled={!canPreviousPage}> Previous </button>
            <button type='button' className='btn btn-success nxtButton' onClick={() => nextPage()} disabled={!canNextPage}> Next </button>
          </div>
        </div> : <h4 className="no-txns"> Sorry no transcations are made in this account for the past one year.</h4>}
        <div className="footer-welcomepage">
        <p className="trademark-welcomepage">© 2023 Pranav Ram Hariharan. All rights reserved. This is a work for my MSc Project.</p>
      </div>
    </div>
  )
} 