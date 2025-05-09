import React from "react";
import styles from "./ReqForm.module.css";
import { getContract } from "../../contract";
import { useState } from "react";
export const ReqForm = ({ offReqform }) => {
  const [beneficiary, setBeneficiary] = useState("child");
  const [category, setCategory] = useState("food");
  const [description, setDescription] = useState("");
  const [breadRequired, setBreadRequired] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleRaiseRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.raiseRequest(
        beneficiary,
        category,
        description,
        breadRequired
      );
      await tx.wait();
      alert("Request raised successfully!");
      offReqform();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error raising request");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className={styles.container}>
      <div className={styles.formContainer}>
        <p
          onClick={offReqform}
          style={{ cursor: "pointer" }}
          className={styles.close}
        >
          x
        </p>
        <h2 className={styles.heading}>Raise Donation Request</h2>
        <form onSubmit={handleRaiseRequest} className={styles.form}>
          <label className={styles.label}>
            Beneficiary:
            <select
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              className={styles.select}
            >
              <option value="child">Child</option>
              <option value="student">Student</option>
              <option value="farmer">Farmer</option>
              <option value="old">Old</option>
            </select>
          </label>

          <label className={styles.label}>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              <option value="food">Food</option>
              <option value="health">Health</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="education">Education</option>
            </select>
          </label>

          <label className={styles.label}>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Describe the purpose of this request..."
              required
            />
          </label>

          <label className={styles.label}>
            BREAD Required:
            <input
              type="number"
              value={breadRequired}
              onChange={(e) => setBreadRequired(e.target.value)}
              min="1"
              className={styles.input}
              required
            />
          </label>

          <div className={styles.buttons}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Raise Request"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
