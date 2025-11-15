export const formatEuro = (amount: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const formatEuroSimple = (amount: number): string => {
  return `€${amount.toFixed(2)}`;
};
