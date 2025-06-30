import React, { useState } from "react";
import { getContract } from "../../contract";
import styles from "./Withdraw.module.css";

export const Withdraw = ({ offWithdraw }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const BREAD_PRICE_ETH = "0.00054";

  const handleWithdraw = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const contract = await getContract();

      setLoading(true);
      const tx = await contract.withdraw(quantity);
      await tx.wait();

      alert(`Successfully bought ${quantity} bread(s)!`);
      setLoading(false);
      offWithdraw();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {!loading && (
        <div className={styles.box}>
          <p
            onClick={offWithdraw}
            style={{ cursor: "pointer" }}
            className={styles.close}
          >
            x
          </p>
          <h2 className={styles.title}>Withdraw Eth</h2>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.input}
          />
          <button
            onClick={handleWithdraw}
            className={styles.button}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : `Withdraw ${(Number(BREAD_PRICE_ETH) * quantity).toFixed(
                  6
                )} ETH`}
          </button>
        </div>
      )}
      {loading && (
        <div className={styles.load}>
          <img src="/cutting.gif" alt="bread" />
        </div>
      )}
    </div>
  );
};
