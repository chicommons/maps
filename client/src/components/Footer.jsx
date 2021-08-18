import React from "react";

import "./Footer.css";

const Footer = (props) => {
  return (
    <footer className="footer">
      <div className="row justify-content-between footer-row">
        <a href="https://www.chicommons.coop/privacy-policy/" className="credit-link">Privacy Policy</a>
        <span>©  2021	Logo Copyright: ChiCommons LWCA</span>
      </div>
      <span className="row justify-content-between footer-row">
        Thanks to:
        <a className="credit-link" href="https://github.com/laredotornado">Dave Alvarado</a>
        |
        <a className="credit-link" href="https://github.com/DaveyDevs">Davey Anians</a>
        |
        <a className="credit-link" href="https://github.com/ozzysChiefDataScientist">Elena Smith</a>
        |
        <a className="credit-link" href="https://github.com/nick-hou">Nick Hou</a>
      </span>
    </footer>
  );
};

export default Footer;
