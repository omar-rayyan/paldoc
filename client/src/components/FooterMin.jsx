import React from "react";
import "../styles/footer.css";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const FooterMin = () => {
  return (
    <>
      <footer>
        <div className="footer-bottom">
          Copyrights reserved - {" "}
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noreferrer"
          >
            PalDoc
          </a>{" "}
          © {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
};

export default FooterMin;