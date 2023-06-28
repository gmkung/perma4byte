//Next.js index.js page
import { useState } from "react";
import { getContract } from "../configureWarpClient.js";
import OverlayForm from "../components/submitModal.js";
import TableComponent from "../components/displayModal.js";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

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
    try {
      const data = await contract
        .setEvaluationOptions({
          remoteStateSyncEnabled: true,
        })
        .readState();
        console.log("data:", data);
        const posts = data.cachedValue.state.functions;
      setLookupResult(posts[searchTerm]);
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

        {lookupResult && <TableComponent data={lookupResult} />}

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
        <p>© 2023 Perma4byte</p>
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
      `}</style>
    </div>
  );
};

export default Index;
