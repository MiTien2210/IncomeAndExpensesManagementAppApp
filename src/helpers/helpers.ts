
  export const formatCurrency = (amount: number | string) => {
  const numericAmount = Number(amount);

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};