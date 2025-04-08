import './result-table.css';

interface ResultTableProps {
  headers: string[];
  data: (string | number)[][];
}

export function ResultTable({ headers, data }: ResultTableProps) {
  return (
    <div className="result-table-container">
      <table className="result-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 