import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
        <h2 className="header--title"><NavLink to="/" className="header--link">Inventory Manager</NavLink></h2>
        <ul>
            <li><NavLink to="/warehouses" className="header--link">Warehouse Manager</NavLink></li>
            <li><NavLink to="/items" className="header--link">Item Manager</NavLink></li>
        </ul>
    </header>
  );
}