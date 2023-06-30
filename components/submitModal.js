import { useState } from "react";
import { getContract } from "../configureWarpClient.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./loadingSpinner.js";

const OverlayForm = ({ onClose }) => {
  const [textValue, setTextValue] = useState("");
  const [loading, setLoadingValue] = useState(false);

  const handleSignatureSubmit = async (event) => {
    event.preventDefault();
    if (!textValue) return;

    setLoadingValue(true);
    const contract = await getContract();

    try {
      const result = await contract.writeInteraction({
        function: "registerFunctions",
        functionStrings: [textValue],
      });
      console.log("result:", result);
      onClose(); // Close the overlay form
    } catch (err) {
      console.log("error:", err);
      toast.error(
        'An error: "' +
          err +
          '". \n Please remember to connect with an Arweave wallet and try again.'
      ); // Display error toast
    }
    setLoadingValue(false);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h3>Enter a new function text signature here</h3>
        <form onSubmit={handleSignatureSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Enter text"
            />
          </div>

          <div className="button-container">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <button type="submit">Submit</button>
            )}
          </div>
        </form>
      </div>
      <style jsx>{`
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

        .modal {
          background-color: #5a5a5a; // Greyed-out background
          padding: 20px;
          border-radius: 10px;
          max-width: 500px;
          width: 80%;
          position: relative;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 15px;
          cursor: pointer;
          color: #00ff00; // Sci-fi green
        }

        .input-container {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .input-container input {
          width: 50%;
        }

        .button-container {
          display: flex;
          justify-content: center;
        }

        .button-container button {
          margin-top: 10px;
        }
      `}</style>
      <ToastContainer />
    </div>
  );
};

export default OverlayForm;
