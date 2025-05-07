import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { getContract } from "../../contract";

export const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [address, setAddress] = useState(null); // State to store the user's address

  useEffect(() => {
    const fetchAccountAndRequests = async () => {
      // Get the user's address
      let userAddress = null;
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            userAddress = accounts[0];
          }
        } catch (error) {
          console.error("Failed to get account:", error);
          // Handle the error appropriately, e.g., show a message to the user
        }
      }

      setAddress(userAddress); // Set the address state

      // Fetch requests, passing the address
      if (userAddress) {
        fetchMyRequests(userAddress);
      }
    };

    fetchAccountAndRequests();
  }, []);

  const fetchMyRequests = async (userAddress) => {
    try {
      const contract = await getContract();
      const myRequestIds = await contract.getRequestsByNGO(userAddress);
      const myRequestsDetails = [];

      for (const id of myRequestIds) {
        const request = await contract.getRequestDetails(id);
        myRequestsDetails.push({
          id: id.toString(),
          ngo: request[0],
          beneficiary: request[1],
          category: request[2],
          description: request[3],
          amountNeeded: request[4].toString(),
          amountReceived: request[5].toString(),
          fulfilled: request[6],
        });
      }
      setRequests(myRequestsDetails);
    } catch (error) {
      console.error("Error fetching your requests:", error);
      alert("Failed to fetch your requests.");
    }
  };

  return (
    <section className={styles.container} id="dashboard">
      <div className={styles.dashboardContainer}>
        <h1 className={styles.title}>Your Requests</h1>
        {address ? ( // Conditionally render based on whether we have an address
          requests.length === 0 ? (
            <p>You haven't created any requests yet.</p>
          ) : (
            <div className={styles.requestList}>
              {requests.map((req) => (
                <div key={req.id} className={styles.requestCard}>
                  <h3>Request ID: {req.id}</h3>
                  <p>Beneficiary: {req.beneficiary}</p>
                  <p>Category: {req.category}</p>
                  <p>Description: {req.description}</p>
                  <p>Amount Needed: {req.amountNeeded}</p>
                  <p>Amount Received: {req.amountReceived}</p>
                  <p>Fulfilled: {req.fulfilled ? "Yes" : "No"}</p>
                  {/* You can add more details or actions here */}
                </div>
              ))}
            </div>
          )
        ) : (
          <p>Please connect your wallet to view your requests.</p>
        )}
      </div>
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
