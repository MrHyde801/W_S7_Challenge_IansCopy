import React from 'react'
import Home from './Home'
import Form from './Form'
import {  NavLink, Routes, Route } from 'react-router-dom'


function App() {
  return (
      <div id="app">
        <nav>
          {/* NavLinks here */}
          <NavLink to="/">Home</NavLink>
          <NavLink to="order">Order</NavLink>
        </nav>
        {/* Route and Routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="order" element={<Form/>} />
        </Routes>
        <Home />
        <Form />
      </div>
   
  )
}

export default App
