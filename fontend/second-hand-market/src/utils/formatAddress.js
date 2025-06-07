export function formatAddress(address) {
  if (!address) return "";
  const { specificAddress, ward, district, province } = address;
  return [specificAddress, ward, district, province].filter(Boolean).join(", ");
} 