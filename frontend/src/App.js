import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"; // Import routing components
import { getContract } from "./contract";
import styles from "./App.module.css";
import { Navbar } from "./Components/Navbar/Navbar";
import { Anim } from "./Components/Anim/Anim";
import { Hero } from "./Components/Hero/Hero";
import { NgoForm } from "./Components/EnrollNgoForm/NgoForm";
import { BuyBread } from "./Components/BuyBread/BuyBread";
import { ReqForm } from "./Components/RequestForm/ReqForm";
import { About } from "./Components/About/About";
import { Dashboard } from "./Components/Dashboard/Dashboard"; // Import the Dashboard component

function App() {
  const [account, setAccount] = useState("");
  const [isNGO, setIsNGO] = useState(false);
  const [Balance, setBalance] = useState(0);
  const [anim, setAnim] = useState(false);
  const [requests, setRequests] = useState([]);
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
        fetchRequests();
      }
    };
    checkIfNGO();
  }, [account]);

  const fetchRequests = async () => {
    const contract = await getContract();
    const allNGOs = await contract.getAllNGOs();

    const ngoNameMap = {};
    allNGOs.forEach((ngo) => {
      ngoNameMap[ngo.ngoAddress] = ngo.name;
    });

    const allRequests = [];

    for (const ngo of allNGOs) {
      const requestIds = await contract.getRequestsByNGO(ngo.ngoAddress);

      for (const id of requestIds) {
        const request = await contract.getRequestDetails(id);

        allRequests.push({
          id: id.toString(),
          ngo: request[0],
          ngoName: ngoNameMap[request[0]], // assign name here
          beneficiary: request[1],
          category: request[2],
          description: request[3],
          amountNeeded: request[4].toString(),
          amountReceived: request[5].toString(),
          fulfilled: request[6],
          donationAmount: "",
        });
      }
    }

    setRequests(allRequests);
  };

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
  const offAnim = () => {
    setAnim(false);
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
      {anim && <Anim offAnim={offAnim} />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero
                requests={requests}
                fetchRequests={fetchRequests}
                setRequests={setRequests}
                setAnim={setAnim}
              />
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
