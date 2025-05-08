import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"; // Import routing components
import { getContract } from "./contract";
import { parseEther, formatEther } from "ethers";
import styles from "./App.module.css";
import { Navbar } from "./Components/Navbar/Navbar";
import { Hero } from "./Components/Hero/Hero";
import { NgoForm } from "./Components/EnrollNgoForm/NgoForm";
import { BuyBread } from "./Components/BuyBread/BuyBread";
import { ReqForm } from "./Components/RequestForm/ReqForm";
import { About } from "./Components/About/About";
import { Dashboard } from "./Components/Dashboard/Dashboard"; // Import the Dashboard component

function App() {
  const [account, setAccount] = useState("");
  const [Ngoform, setNgoform] = useState(false);
  const [isNGO, setIsNGO] = useState(false);
  const [Balance, setBalance] = useState(0);
  const navigate = useNavigate(); // Use navigate for programmatic routing

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
          setBalance(String(balance));
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
        navigate("/ngo-form"); // Use navigate
      }
    } catch (error) {
      console.error("Error checking NGO registration:", error);
      alert("Failed to verify NGO registration status.");
    }
  };

  const closeForm = () => {
    navigate("/"); // Go to home.  Consider where you want to go.
  };

  //Request raise form
  const onReqform = () => {
    navigate("/req-form");
  };
  const offReqform = () => {
    navigate("/"); // Go to home. Consider where you want to go.
  };

  //Dasboard
  const onDashboard = () => {
    navigate("/dashboard");
  };

  //Buy Bread
  const onBuyBread = () => {
    navigate("/buy-bread");
  };
  const offBuyBread = () => {
    navigate("/"); // Go to home.
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
      navigate("/"); // Go to home
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
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
            </>
          }
        />{" "}
        {/* Combine Hero and About on home */}
        <Route
          path="/ngo-form"
          element={<NgoForm closeform={closeForm} onSubmit={handleNgoSubmit} />}
        />
        <Route
          path="/buy-bread"
          element={<BuyBread offBuyBread={offBuyBread} />}
        />
        <Route path="/req-form" element={<ReqForm offReqform={offReqform} />} />
        <Route
          path="/dashboard"
          element={<Dashboard address={account} />}
        />{" "}
        {/* Dashboard Route */}
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
