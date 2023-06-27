const TableComponent = ({ data }) => {
  return (
    <div className="centered-container">
      <h3 className="centered-title">Query results</h3>
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
        }
        h3 {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default TableComponent;
