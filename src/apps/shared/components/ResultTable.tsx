import React from 'react';

interface ResultTableProps {
  headers: string[];
  data: (string | number)[][];
}

export const ResultTable: React.FC<ResultTableProps> = ({ headers, data }) => {
  return (
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
  );
}; 