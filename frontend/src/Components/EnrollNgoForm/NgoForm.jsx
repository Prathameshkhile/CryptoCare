import React from "react";
import styles from "./NgoForm.module.css";
import { useState } from "react";
export const NgoForm = ({ onSubmit, closeform }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    location: "",
    website: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p
          onClick={closeform}
          style={{ cursor: "pointer" }}
          className={styles.close}
        >
          x
        </p>
        <h2 className={styles.heading}>Register as NGO</h2>

        <label className={styles.label}>NGO Name</label>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Phone Number</label>
        <input
          className={styles.input}
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Location</label>
        <input
          className={styles.input}
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Website</label>
        <input
          className={styles.input}
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />

        <button className={styles.button} type="submit">
          Submit
        </button>
      </form>
    </section>
  );
};
