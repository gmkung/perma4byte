const TableComponent = ({ data }) => {
    return (
      <div className="centered-container">
        <h4 className="centered-title">Query results</h4>
        <table className="centered-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <td>
                  <b>{key}</b>:
                </td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <style jsx>{`
          .centered-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #39453C;
            border-radius: 15px;
            margin: 20px;
            padding: 20px;
          }
          h3 {
            color: white;
          }
          .centered-table {
            color: #0f0;
            border-collapse: collapse;
          }
          .centered-table th,
          .centered-table td {
            padding: 10px;
            border: 1px solid #0f0;
          }
        `}</style>
      </div>
    );
  };
  
  export default TableComponent;
  