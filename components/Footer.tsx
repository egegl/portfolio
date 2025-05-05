'use client';

import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <span style={{display:'flex',alignItems:'center',gap:8}}>
        <p className="footer-text">📍Atlanta, GA</p>
      </span>
      <a href="https://www.linkedin.com/in/ege-gursel"
        target="_blank"
        rel="noopener noreferrer"
      >
        <u>LinkedIn</u>
      </a>
    </footer>
  );
}
