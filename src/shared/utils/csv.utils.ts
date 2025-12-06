import { AdviceCsvRow } from '../types/csv.types';
import * as fs from 'fs';
import * as path from 'path';

export const parseAdviceCsv = (): AdviceCsvRow[] => {
  const csvPath = path.join(__dirname, '..', 'data', 'advice.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const rows = parseCsvWithMultiline(csvContent);

  return rows.slice(1).map((values) => ({
    type: values[0] || '',
    subtype: values[1] || '',
    state: values[2] || '',
    accepted: values[3]?.toLowerCase() === 'true',
    text: (values[4] || '').replace(/\r/g, ''),
  }));
};

const parseCsvWithMultiline = (content: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentValue.trim());
      currentValue = '';
    } else if (
      (char === '\n' || (char === '\r' && nextChar === '\n')) &&
      !inQuotes
    ) {
      currentRow.push(currentValue.trim());
      if (currentRow.some((v) => v !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
      if (char === '\r') i++;
    } else {
      currentValue += char;
    }
  }

  if (currentValue || currentRow.length > 0) {
    currentRow.push(currentValue.trim());
    if (currentRow.some((v) => v !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
};
