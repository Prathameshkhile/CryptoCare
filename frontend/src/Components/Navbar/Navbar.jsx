import React from "react";
import styles from "./Navbar.module.css";
import { useState } from "react";
import BreadIcon from "./Bread.png";

export const Navbar = ({
  connectWallet,
  account,
  onNgoClick,
  onReqform,
  onDashboard, // This prop will now be the navigation function
  onBuyBread,
  onWithdraw,
  isNGO,
  balance,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className={styles.navbar}>
      <a className={styles.title} href="/">
        CryptoCare
      </a>
      <div className={styles.menu}>
        <ul
          onClick={() => setMenuOpen(false)}
          className={`${styles.menuItems} ${menuOpen && styles.menuOpen}`}
        >
          {!isNGO && (
            <li>
              <a onClick={onNgoClick} style={{ cursor: "pointer" }}>
                List as NGO
              </a>
            </li>
          )}
          {isNGO && (
            <li>
              <a onClick={onReqform} style={{ cursor: "pointer" }}>
                Raise Request
              </a>
            </li>
          )}
          {isNGO && (
            <li>
              <a onClick={onDashboard} style={{ cursor: "pointer" }}>
                NGO Dashboard
              </a>
            </li>
          )}
          <li>
            <a onClick={onBuyBread} style={{ cursor: "pointer" }}>
              Buy BREAD
            </a>
          </li>
          <li>
            <a onClick={onWithdraw} style={{ cursor: "pointer" }}>
              Withdraw
            </a>
          </li>
          <li>
            {account ? (
              <p className={styles.acc}>
                ✅ {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )}
          </li>
          <li>
            <img src={BreadIcon} alt="bread" />
            <a className={styles.balance}>{balance}</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
