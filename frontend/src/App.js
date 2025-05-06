import React, { useState, useEffect } from "react";
import { getContract } from "./contract";
import { parseEther, formatEther } from "ethers";
import styles from "./App.module.css";
import { Navbar } from "./Components/Navbar/Navbar";
import { Hero } from "./Components/Hero/Hero";
import { NgoForm } from "./Components/EnrollNgoForm/NgoForm";
import { BuyBread } from "./Components/BuyBread/BuyBread";
import { ReqForm } from "./Components/RequestForm/ReqForm";
import { About } from "./Components/About/About";

function App() {
  const [account, setAccount] = useState("");
  const [Ngoform, setNgoform] = useState(false);
  const [Dashboard, setDashboard] = useState(false);
  const [Reqform, setReqform] = useState(false);
  const [isNGO, setIsNGO] = useState(false);
  const [Buybread, setBuyBread] = useState(false);
  const [Balance, setBalance] = useState(0);

  // 📌 Check Wallet Connection
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkWalletConnection();
  }, []);

  // 📌 Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };
  useEffect(() => {
    const checkIfNGO = async () => {
      if (account) {
        try {
          const contract = await getContract();
          const registered = await contract.isRegistered(account);
          const balance = await contract.breadBalances(account);
          setBalance(balance.toString());
          setIsNGO(registered);
        } catch (error) {
          console.error("Error checking NGO status:", error);
        }
      }
    };

    checkIfNGO();
  }, [account]);

  //To Hide and unhide form
  const handleNgoClick = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const contract = await getContract(); // Make sure it returns NGORegistry instance
      const isAlreadyRegistered = await contract.isRegistered(account);

      if (isAlreadyRegistered) {
        alert("You are already listed as an NGO.");
      } else {
        setNgoform(true); // Show form if not listed
      }
    } catch (error) {
      console.error("Error checking NGO registration:", error);
      alert("Failed to verify NGO registration status.");
    }
  };

  const closeForm = () => {
    setNgoform(false);
  };

  //Request raise form
  const onReqform = () => {
    setReqform(true);
  };
  const offReqform = () => {
    setReqform(false);
  };

  //Dasboard
  const onDashboard = () => {
    setDashboard(true);
  };
  const offDashboard = () => {
    setDashboard(false);
  };

  //Buy Bread
  const onBuyBread = () => {
    setBuyBread(true);
  };
  const offBuyBread = () => {
    setBuyBread(false);
  };

  //List as Ngo to blockchain
  const handleNgoSubmit = async (formData) => {
    try {
      const contract = await getContract();

      const tx = await contract.listAsNGO(
        formData.name,
        formData.description,
        formData.phone,
        formData.location,
        formData.website
      );

      await tx.wait(); // Wait for confirmation

      alert("NGO listed successfully!");
      setNgoform(false); // Close the form
      window.location.reload();
    } catch (error) {
      console.error("Error listing NGO:", error);
      alert("Failed to list NGO. See console for details.");
    }
  };

  return (
    <div className={styles.App}>
      <Navbar
        connectWallet={connectWallet}
        account={account}
        onNgoClick={handleNgoClick}
        isNGO={isNGO}
        onReqform={onReqform}
        onDashboard={onDashboard}
        onBuyBread={onBuyBread}
        balance={Balance}
      />
      {Ngoform && <NgoForm closeform={closeForm} onSubmit={handleNgoSubmit} />}
      {Buybread && <BuyBread offBuyBread={offBuyBread} />}
      {Reqform && <ReqForm offReqform={offReqform} />}
      <Hero />
      <About />
    </div>
  );
}

export default App;
