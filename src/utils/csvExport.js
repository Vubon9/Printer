/**
 * Utility for exporting data tables to CSV
 */

export function exportToCSV(filename, rows, headers) {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(headers);

  let csvContent =
    keys.map((k) => `"${headers[k]}"`).join(separator) + '\n';

  rows.forEach((row) => {
    const line = keys
      .map((k) => {
        let val = row[k] !== undefined && row[k] !== null ? row[k] : '';
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(separator);
    csvContent += line + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
