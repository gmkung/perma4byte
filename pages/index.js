//Next.js index.js page
import { useState, useEffect } from "react";
import { getContract } from "../configureWarpClient.js";
import OverlayForm from "../components/submitModal.js";
import TableComponent from "../components/displayModal.js";
import LoadingSpinner from "../components/loadingSpinner.js";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lookupResult, setLookupResult] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [functionCount, setFunctionCount] = useState(null);
  const [hashCount, setHashCount] = useState(null);

  // Moved data fetch to useEffect
  useEffect(() => {
    const fetchData = async () => {
      const contract = await getContract();

      try {
        const data = await contract
          .setEvaluationOptions({
            remoteStateSyncEnabled: true,
          })
          .readState();
        setFunctionCount(data.cachedValue.state.functionCount);
        setHashCount(data.cachedValue.state.functionHashCount);
      } catch (err) {
        console.log("error: ", err);
      }
    };

    fetchData();
  }, [showOverlay]); // This empty array causes this effect to run once on component mount

  const handleOpenOverlay = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    const contract = await getContract();
    console.log("Contract:", contract);
    setLookupResult(null);
    try {
      const data = await contract
        .setEvaluationOptions({
          remoteStateSyncEnabled: true,
        })
        .readState();
      console.log("data:", data);
      const posts = data.cachedValue.state.functions;
      console.log("posts[searchTerm.trim()]:", posts[searchTerm.trim()]);
      setLookupResult(posts[searchTerm.trim()] || []);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <div className="page-container">
      <header>
        <h1>Perma4byte</h1>
        <p>The decentralized Ethereum function lookup service</p>
      </header>
      <p className="info">
        Total functions:{" "}
        {functionCount !== null ? functionCount : <LoadingSpinner />} | Total
        hashes: {hashCount !== null ? hashCount : <LoadingSpinner />}
      </p>

      <main>
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter function hash..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {lookupResult ? (
          lookupResult.map((data, index) => (
            <TableComponent key={index} data={data} />
          ))
        ) : (
          <span style={{ paddingBottom: "20px" }}>
            <LoadingSpinner />
          </span>
        )}

        <button onClick={handleOpenOverlay}>
          Submit new function signature
        </button>

        {showOverlay && (
          <div className="overlay">
            <OverlayForm onClose={handleCloseOverlay} />
          </div>
        )}
      </main>
      <footer>
        <p>Copyright 2023 © Perma4byte</p>
      </footer>

      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
        }

        header {
          text-align: center;
          background-color: #000000;
          color: #00ff00;
          padding: 20px;
        }

        header h1 {
          margin: 0;
          font-size: 2.5em;
        }

        header p {
          margin: 0;
          font-size: 1.5em;
        }

        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
        }

        .search-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2em;
        }

        .search-bar input {
          flex-grow: 1;
          margin-right: 1em;
          padding: 10px;
          font-size: 1em;
          border-radius: 4px;
          border: none;
          background: #39453c;
          color: #00ff00;
        }

        footer {
          text-align: center;
          padding: 20px;
          background: #000000;
          color: #00ff00;
        }

        .info {
          font-size: 0.8em;
          text-align: center;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Index;
