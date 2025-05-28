
// Fixed exchange rate - can be easily updated
export const USD_TO_NGN_RATE = 1600;

export const convertNgnToUsd = (ngnAmount: number): number => {
  return ngnAmount / USD_TO_NGN_RATE;
};

export const convertUsdToNgn = (usdAmount: number): number => {
  return usdAmount * USD_TO_NGN_RATE;
};

export const formatCurrency = (amount: number, currency: 'NGN' | 'USD' = 'NGN'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDualCurrency = (ngnAmount: number): string => {
  const usdAmount = convertNgnToUsd(ngnAmount);
  return `${formatCurrency(ngnAmount, 'NGN')} (${formatCurrency(usdAmount, 'USD')})`;
};
