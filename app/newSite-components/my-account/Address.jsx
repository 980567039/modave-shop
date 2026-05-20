"use client";
import React, { useState, useEffect } from "react";

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "Australia",
    city: "",
    isDefault: true,
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/site/account/address");
        if (response.ok) {
          const data = await response.json();
          // Ensure addresses have an id property for rendering
          const formattedAddresses = (data.data || []).map((addr, index) => ({
             ...addr,
             id: addr.id || index, // Use existing ID or index as fallback
             title: addr.addressType || (index === 0 ? "Default" : "Other"), // Example title logic
             isEditing: false
          }));
          setAddresses(formattedAddresses);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleEditToggle = (id) => {
    setAddresses((prev) =>
      prev.map((address) =>
        address.id === id
          ? { ...address, isEditing: !address.isEditing }
          : address
      )
    );
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((address) => address.id !== id));
  };

  if (loading) return <div>Loading...</div>;



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Optimistic update or wait for server?
    // Let's create the new address object
    const newItem = {
        id: Date.now(), // temporary ID
        addressType: newAddress.isDefault ? "Default" : "Other",
        name: `${newAddress.firstName} ${newAddress.lastName}`,
        street: newAddress.address,
        city: newAddress.city,
        phone: newAddress.phone,
        // Map other fields as needed by backend or UI
    };

    const updatedAddresses = [...addresses, newItem];
    setAddresses(updatedAddresses);

    // Call API to save (simplified logic: send all addresses as shippingAddress)
    // Note: detailed mapping to backend schema might be needed if schema is strict
    // Assuming backend takes shippingAddress array directly
    try {
        const payload = {
            shippingAddress: updatedAddresses.map(addr => ({
                id: addr.id,
                addressType: addr.title || addr.addressType,
                name: addr.name,
                street: addr.street,
                city: addr.city,
                phone: addr.phone,
                // Add other fields if schema requires
            }))
        };
        
        const res = await fetch("/api/site/account/address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error("Failed to save address");
        }

        // Reset form and hide
        setNewAddress({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            country: "Australia",
            city: "",
            isDefault: true,
        });
        document.querySelector(".createForm").classList.toggle("d-block");

    } catch (err) {
        console.error(err);
        // Revert state on error?
        // implement revert logic if needed
    }
  };

  return (
    <div className="my-account-content">
      <div className="account-address">
        <div className="text-center widget-inner-address">
          <button
            className="tf-btn btn-fill radius-4 mb_20 btn-address"
            onClick={() =>
              document.querySelector(".createForm").classList.toggle("d-block")
            }
          >
            <span className="text text-caption-1">Add a new address</span>
          </button>
          <form
            className="show-form-address wd-form-address createForm"
            onSubmit={handleAddAddress}
          >
            <div className="title">Add a new address</div>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="First Name*"
                  name="firstName"
                  value={newAddress.firstName}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Last Name*"
                  name="lastName"
                  value={newAddress.lastName}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
            </div>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="email"
                  placeholder="Username or email address*"
                  name="email"
                  value={newAddress.email}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Phone*"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
            </div>
            <fieldset className="mb_20">
              <input
                className=""
                type="text"
                placeholder="Address"
                name="address"
                value={newAddress.address}
                onChange={handleInputChange}
                required
              />
            </fieldset>
            <div className="tf-select mb_20">
              <select
                className="text-title"
                name="country"
                value={newAddress.country}
                onChange={handleInputChange}
              >
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Belgium">Belgium</option>
                <option value="Canada">Canada</option>
                <option value="China">China</option>
                <option value="France">France</option>
                <option value="Germany">Germany</option>
                <option value="Italy">Italy</option>
                <option value="Japan">Japan</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                {/* Add other options as needed or keep full list */}
              </select>
            </div>
            <fieldset className="mb_20">
              <input
                className=""
                type="text"
                placeholder="City"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                required
              />
            </fieldset>
            <div className="tf-cart-checkbox mb_20">
              <div className="tf-checkbox-wrapp">
                <input
                  className=""
                  type="checkbox"
                  id="CartDrawer-Form_agree"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleInputChange}
                />
                <div>
                  <i className="icon-check" />
                </div>
              </div>
              <label htmlFor="CartDrawer-Form_agree">
                Set as default address.
              </label>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-20">
              <button type="submit" className="tf-btn btn-fill radius-4">
                <span className="text">Add address</span>
              </button>
              <span
                className="tf-btn btn-fill radius-4 btn-hide-address"
                onClick={() =>
                  document
                    .querySelector(".createForm")
                    .classList.remove("d-block")
                }
              >
                <span className="text">Cancel</span>
              </span>
            </div>
          </form>
          <div className="list-account-address">
            {addresses.map((address) => (
              <div className="account-address-item" key={address.id}>
                <h6 className="mb_20">{address.title}</h6>
                <p>{address.name}</p>
                <p>{address.street}</p>
                <p>{address.city}</p>
                <p>{address.website}</p>
                <p className="mb_10">{address.phone}</p>
                <div className="d-flex gap-10 justify-content-center">
                  <button
                    className="tf-btn radius-4 btn-fill justify-content-center btn-edit-address"
                    onClick={() => handleEditToggle(address.id)}
                  >
                    <span className="text">
                      {address.isEditing ? "Close" : "Edit"}
                    </span>
                  </button>
                  <button
                    className="tf-btn radius-4 btn-outline justify-content-center btn-delete-address"
                    onClick={() => handleDelete(address.id)}
                  >
                    <span className="text">Delete</span>
                  </button>
                </div>
                {address.isEditing && (
                  <form
                    className="edit-form-address wd-form-address d-block"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div className="title">Edit address</div>
                    <fieldset className="mb_20">
                      <input
                        type="text"
                        placeholder="First Name*"
                        name="firstName"
                        required
                      />
                    </fieldset>
                    <fieldset className="mb_20">
                      <input
                        type="text"
                        placeholder="Last Name*"
                        name="lastName"
                        required
                      />
                    </fieldset>
                    <fieldset className="mb_20">
                      <input
                        type="email"
                        placeholder="Email*"
                        name="email"
                        required
                      />
                    </fieldset>
                    <fieldset className="mb_20">
                      <input
                        type="text"
                        placeholder="Phone*"
                        name="phone"
                        required
                      />
                    </fieldset>
                    <fieldset className="mb_20">
                      <input
                        type="text"
                        placeholder="Address"
                        name="address"
                        required
                      />
                    </fieldset>
                    <div className="tf-select mb_20">
                      <select name="country" required>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        {/* Add more countries here */}
                      </select>
                    </div>
                    <fieldset className="mb_20">
                      <input
                        className=""
                        type="text"
                        placeholder="City"
                        name="text"
                        tabIndex="2"
                        defaultValue=""
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <div className="tf-cart-checkbox mb_20">
                      <div className="tf-checkbox-wrapp">
                        <input
                          defaultChecked
                          className=""
                          type="checkbox"
                          id="CartDrawer-Form_agree"
                          name="agree_checkbox"
                        />
                        <div>
                          <i className="icon-check"></i>
                        </div>
                      </div>
                      <label htmlFor="CartDrawer-Form_agree">
                        Set as default address.
                      </label>
                    </div>
                    <div className="d-flex flex-column gap-20">
                      <button
                        type="submit"
                        className="tf-btn btn-fill radius-4"
                      >
                        <span className="text">Add address</span>
                      </button>
                      <span
                        onClick={() => handleEditToggle(address.id)}
                        className="tf-btn btn-fill radius-4 btn-hide-edit-address"
                      >
                        <span className="text">Cancel</span>
                      </span>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
