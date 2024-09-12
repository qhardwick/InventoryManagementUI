import React from 'react';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Warehouses from './pages/Warehouses.jsx';
import Items from './pages/Items.jsx';
import ItemEditForm from './pages/ItemEditForm.jsx';
import WarehousesEditForm from './pages/WarehouseEditForm.jsx';
import WarehouseItems from './pages/WarehouseItems.jsx';

export default function App() {

  return (
    <>
      <BrowserRouter basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/warehouses/:id" element={<WarehousesEditForm />} />
          <Route path="/warehouses/:id/items" element={<WarehouseItems />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemEditForm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
