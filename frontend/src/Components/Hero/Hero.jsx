import React, { useState } from "react";
import styles from "./Hero.module.css";
import { getContract } from "../../contract";

export const Hero = ({ requests, fetchRequests, setRequests, setAnim }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleCard = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getImagePath = (beneficiary, category, fulfilled) => {
    const state = fulfilled ? "happy" : "sad";
    return `/assets/images/${beneficiary.toLowerCase()}_${state}.png`;
  };

  const donateBread = async (index) => {
    const contract = await getContract();
    const { id, donationAmount } = requests[index];

    const amount = parseInt(donationAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid donation amount.");
      return;
    }

    try {
      const tx = await contract.donateBread(parseInt(id), amount);
      await tx.wait();
      alert("Donation successful!");
      fetchRequests();
      setAnim(true);
    } catch (err) {
      alert("Donation failed: " + err.message);
    }
  };

  const visibleRequests = requests.filter((r) => !r.fulfilled);

  return (
    <section className={styles.container} id="hero">
      <div className={styles.heroContainer}>
        <h1 className={styles.title}>Requests For Help</h1>
        <div className={styles.cardGrid}>
          {visibleRequests.map((req, i) => (
            <div
              key={i}
              className={`${styles.card} ${
                expandedIndex === i ? styles.expanded : ""
              }`}
              onClick={() => toggleCard(i)}
            >
              <p className={styles.ngoName}>{req.ngoName}</p>

              <img
                src={getImagePath(req.beneficiary, req.category, req.fulfilled)}
                alt={req.beneficiary}
                className={styles.image}
              />
              <h3 className={styles.cardTitle}>
                {req.beneficiary} needs {req.category}
              </h3>
              <p className={styles.cardText}>
                BREAD needed: {req.amountNeeded}
              </p>
              {expandedIndex === i && (
                <div className={styles.extraInfo}>
                  <p>{req.description}</p>
                  <input
                    className={styles.in}
                    type="number"
                    min="1"
                    placeholder="Enter amount to donate"
                    value={req.donationAmount}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const newAmount = e.target.value;
                      setRequests((prev) =>
                        prev.map((r, idx) =>
                          idx === i ? { ...r, donationAmount: newAmount } : r
                        )
                      );
                    }}
                  />
                  <button
                    className={styles.donateBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      donateBread(i);
                    }}
                  >
                    Donate BREAD
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
