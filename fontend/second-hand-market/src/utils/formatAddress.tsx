interface Address {
  specificAddress?: string;
  ward?: string;
  district?: string;
  province?: string;
}

export function formatAddress(address: Address | null | undefined): string {
  if (!address) return "";
  const { specificAddress, ward, district, province } = address;
  return [specificAddress, ward, district, province].filter(Boolean).join(", ");
}
