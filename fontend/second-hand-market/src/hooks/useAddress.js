import { useState, useEffect } from "react";
import AddressContext from "../contexts/AddressContext";

export function useAddress() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      const addresses = await AddressContext.getAddresses();
      setAddresses(addresses);
      const defaultAddress = addresses.find((address) => address.default === true);
      setSelectedAddress(defaultAddress);
    };
    fetchAddresses();
  }, []);

  const addAddress = async (address) => {
    await AddressContext.addAddress(address);
    const updatedAddresses = await AddressContext.getAddresses();
    setAddresses(updatedAddresses);
    const addedAddress = updatedAddresses[updatedAddresses.length - 1];
    if (address.default || updatedAddresses.length === 1) {
      setSelectedAddress(addedAddress);
    }
  };

  return { addresses, selectedAddress, setSelectedAddress, addAddress };
} 