'use client';

import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-location">📍 Atlanta, GA</span>
        <div className="footer-links">
          <a href="https://github.com/egegl" className="footer-link">
            GitHub
          </a>
          {' • '}
          <a href="https://linkedin.com/in/ege-gursel" className="footer-link">
            LinkedIn
          </a>
          {' • '}
          <a href="mailto:ege.gursel@emory.edu" className="footer-link">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
