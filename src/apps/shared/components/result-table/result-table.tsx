import React from 'react';
import { useTranslation } from 'react-i18next';
import './result-table.css'

interface ResultTableProps {
  headers: string[];
  data: (string | number)[][];
  translateHeaders?: boolean;
}

export const ResultTable: React.FC<ResultTableProps> = ({ 
  headers, 
  data,
  translateHeaders = false
}) => {
  const { t } = useTranslation();
  
  // Translate headers if needed
  const translatedHeaders = translateHeaders 
    ? headers.map(header => t(header))
    : headers;
  
  return (
    <table className="result-table">
      <thead>
        <tr>
          {translatedHeaders.map((header, index) => (
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