/**
 * Return finance class
 * @param value - The number to format
 * @returns Class if negative, else empty string
 */
export const financeClass = (value: number): string => {
  return value < 0 ? 'bg-red' : value > 0 ? 'bg-green' : '';
};

/**
 * Format a number as currency (e.g., $4,586,090 or -$4,586,090)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, decimals: number = 0): string => {
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);

  const formatted = absoluteValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return isNegative ? `-$${formatted}` : `$${formatted}`;
};

/**
 * Format a number with commas (e.g., 4,586,090)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format a number as percentage (e.g., 45.5%)
 * @param value - The number to format (0.455 = 45.5%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};
