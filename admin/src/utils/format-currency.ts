export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('de-DE').format(value)
}
