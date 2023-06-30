const LoadingSpinner = () => (
    <span className="spinner">
      {" "}
      <style jsx>{`
        .spinner {
          display: inline-block;
          width: 1em;
          height: 1em;
          border: 2px solid rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          border-top-color: #00ff00;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </span>
  );

  export default LoadingSpinner