import React, { useState } from "react";
import { getContract } from "../../contract";
import { parseEther } from "ethers";
import styles from "./BuyBread.module.css";

export const BuyBread = ({ offBuyBread }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const BREAD_PRICE_ETH = "0.00054";

  const handleBuyBread = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const contract = await getContract();
      const pricePerBread = parseEther(BREAD_PRICE_ETH); // returns BigInt
      const totalCost = pricePerBread * BigInt(quantity); // ✅ works with BigInt

      setLoading(true);
      const tx = await contract.buyBread(quantity, { value: totalCost });
      await tx.wait();

      alert(`Successfully bought ${quantity} bread(s)!`);
      setLoading(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Transaction failed.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <p
          onClick={offBuyBread}
          style={{ cursor: "pointer" }}
          className={styles.close}
        >
          x
        </p>
        <h2 className={styles.title}>Buy Bread</h2>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className={styles.input}
        />
        <button
          onClick={handleBuyBread}
          className={styles.button}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : `Buy for ${(Number(BREAD_PRICE_ETH) * quantity).toFixed(6)} ETH`}
        </button>
      </div>
    </div>
  );
};
