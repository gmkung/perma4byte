import { useState } from "react";
import { getContract } from "../configureWarpClient.js";
import OverlayForm from "../components/submitModal.js";
import TableComponent from "../components/displayModal.js";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  //var lookupResult={asd:"312"};
  const [functionDetails, setFunctionDetails] = useState(null);
  //for the overlay
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
    // This is where you'll call your search function to retrieve function details.
    // Set your data to functionDetails state.
    // setFunctionDetails(response);
    const contract = await getContract();
    console.log(contract); //0x680df015
    try {
      const data = await contract.readState();
      const posts = data.cachedValue.state.functions;
      //this.lookupResult = posts[searchTerm];
      console.log("retrieved result: ", posts[searchTerm]);
      setLookupResult(posts[searchTerm]);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <div>
      <header>
        <h1>Ethereum Function Explorer</h1>
      </header>
      <main>
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search function signatures..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="results">
          {lookupResult && Object.keys(lookupResult).length > 0 && (
            <div className="table-container">
              <TableComponent data={lookupResult} />
            </div>
          )}
        </div>
        <br />
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
        header {
          text-align: center;
          color: #00ff00; // Sci-fi green
          font-family: "Courier New", Courier, monospace; // Monospace fonts for sci-fi look
          background-color: #000; // Black background
          padding: 20px 0;
        }

        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 120px);
          background-color: #000;
          color: #00ff00;
          font-family: "Courier New", Courier, monospace;
          padding: 50px 0;
        }

        .search-container {
          display: flex;
          align-items: center;
        }

        .search-container input,
        .search-container button {
          margin: 5px;
        }

        .results {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .table-container {
          background-color: #111; // Lighter than black
          border-radius: 10px; // Rounded edges
          padding: 20px;
          color: white;
          width: 80%; // Set a width
          transition: all 0.3s ease-in-out; // Sliding effect
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5); // Semi-transparent black
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer {
          text-align: center;
          color: #00ff00; // Sci-fi green
          font-family: "Courier New", Courier, monospace; // Monospace fonts for sci-fi look
          background-color: #000; // Black background
          padding: 20px 0;
        }

        input,
        button {
          color: #000; // Black
          background-color: #0f0; // Bright Green
          border: none;
          padding: 10px 20px;
          font-size: 16px;
        }

        button {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Index;
