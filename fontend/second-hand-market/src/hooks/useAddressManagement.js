import { useState, useEffect } from "react";
import axios from "axios";
import AddressContext from "../contexts/AddressContext";
import { useNotification } from "./useNotification";
import { filterLocations, validateAddress } from "../utils/checkoutUtils";
import { GHN_CONFIG, FORM_VALIDATION_MESSAGES } from "../constants/checkout";

export const useAddressManagement = (refreshAddresses) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    specificAddress: "",
    ward: "",
    district: "",
    province: "",
    wardCode: "",
    districtId: "",
    isDefault: false,
  });

  // Location data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Filtered location data for dropdowns
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);

  // Dropdown visibility states
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);

  const { showWarning, showError } = useNotification();

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_GHN_API_URL}/province`,
          {
            headers: { Token: process.env.REACT_APP_GHN_TOKEN },
          }
        );
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (
        newAddress.province &&
        process.env.REACT_APP_GHN_API_URL &&
        process.env.REACT_APP_GHN_TOKEN
      ) {
        try {
          const selectedProvince = provinces.find(
            (p) => p.ProvinceName === newAddress.province
          );
          if (selectedProvince) {
            const response = await axios.get(
              `${process.env.REACT_APP_GHN_API_URL}/district`,
              {
                headers: { Token: process.env.REACT_APP_GHN_TOKEN },
                params: { province_id: selectedProvince.ProvinceID },
              }
            );
            setDistricts(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [newAddress.province, provinces]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (
        newAddress.district &&
        process.env.REACT_APP_GHN_API_URL &&
        process.env.REACT_APP_GHN_TOKEN
      ) {
        try {
          const selectedDistrict = districts.find(
            (d) => d.DistrictName === newAddress.district
          );
          if (selectedDistrict) {
            const response = await axios.get(
              `${process.env.REACT_APP_GHN_API_URL}/ward`,
              {
                headers: { Token: process.env.REACT_APP_GHN_TOKEN },
                params: { district_id: selectedDistrict.DistrictID },
              }
            );
            setWards(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      } else {
        setWards([]);
      }
    };

    fetchWards();
  }, [newAddress.district, districts]);

  // Handle form input changes
  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    });

    // Filter locations based on input
    if (name === "province") {
      const filtered = filterLocations(provinces, value, "ProvinceName");
      setFilteredProvinces(filtered);
      setShowProvinceDropdown(filtered.length > 0 && value.length > 0);
    } else if (name === "district") {
      const filtered = filterLocations(districts, value, "DistrictName");
      setFilteredDistricts(filtered);
      setShowDistrictDropdown(filtered.length > 0 && value.length > 0);
    } else if (name === "ward") {
      const filtered = filterLocations(wards, value, "WardName");
      setFilteredWards(filtered);
      setShowWardDropdown(filtered.length > 0 && value.length > 0);
    }
  };

  // Handle location selection from dropdown
  const handleSelectProvince = (province) => {
    setNewAddress({
      ...newAddress,
      province: province.ProvinceName,
      district: "",
      districtId: "",
      ward: "",
      wardCode: "",
    });
    setShowProvinceDropdown(false);
  };

  const handleSelectDistrict = (district) => {
    setNewAddress({
      ...newAddress,
      district: district.DistrictName,
      districtId: district.DistrictID,
      ward: "",
      wardCode: "",
    });
    setShowDistrictDropdown(false);
  };

  const handleSelectWard = (ward) => {
    console.log(ward.WardCode);
    setNewAddress({
      ...newAddress,
      ward: ward.WardName,
      wardCode: ward.WardCode,
    });
    setShowWardDropdown(false);
  };

  // Handle adding new address
  const handleAddNewAddress = async () => {
    try {
      if (!validateAddress(newAddress)) {
        showWarning(FORM_VALIDATION_MESSAGES.REQUIRED_FIELDS);
        return null;
      }

      await AddressContext.createAddress(newAddress);
      const updatedAddresses = await refreshAddresses();

      // Get the newly added address
      const addedAddress = updatedAddresses[updatedAddresses.length - 1];

      // Reset form
      setNewAddress({
        fullName: "",
        phoneNumber: "",
        specificAddress: "",
        ward: "",
        district: "",
        province: "",
        isDefault: false,
        wardCode: "",
        districtId: "",
      });
      setShowNewAddressForm(false);

      return addedAddress;
    } catch (error) {
      console.error("Error adding new address:", error);
      showError(FORM_VALIDATION_MESSAGES.FAILED_TO_ADD_ADDRESS);
      return null;
    }
  };

  // Handle dropdown focus
  const handleLocationFocus = (type) => {
    switch (type) {
      case "province":
        if (!newAddress.province) {
          setFilteredProvinces(provinces);
        }
        setShowProvinceDropdown(true);
        break;
      case "district":
        if (!newAddress.district) {
          setFilteredDistricts(districts);
        }
        setShowDistrictDropdown(true);
        break;
      case "ward":
        if (!newAddress.ward) {
          setFilteredWards(wards);
        }
        setShowWardDropdown(true);
        break;
    }
  };

  // Handle dropdown blur
  const handleLocationBlur = (type) => {
    setTimeout(() => {
      switch (type) {
        case "province":
          setShowProvinceDropdown(false);
          break;
        case "district":
          setShowDistrictDropdown(false);
          break;
        case "ward":
          setShowWardDropdown(false);
          break;
      }
    }, 150);
  };

  return {
    // Modal states
    showAddressModal,
    setShowAddressModal,
    showNewAddressForm,
    setShowNewAddressForm,

    // Form state
    newAddress,
    setNewAddress,

    // Location data
    provinces,
    districts,
    wards,
    filteredProvinces,
    filteredDistricts,
    filteredWards,

    // Dropdown states
    showProvinceDropdown,
    showDistrictDropdown,
    showWardDropdown,

    // Handlers
    handleNewAddressChange,
    handleSelectProvince,
    handleSelectDistrict,
    handleSelectWard,
    handleAddNewAddress,
    handleLocationFocus,
    handleLocationBlur,
  };
};
