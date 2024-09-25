import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
        <h1>Hello</h1>
      <div className="landing-button">
        <Link className="landing-link" to={'/warehouses'}>Warehouse Manager</Link>
      </div>
      <div className="landing-button">
        <Link className="landing-link" to={'/items'}>Item Manager</Link>
      </div>
    </div>    
  );
}