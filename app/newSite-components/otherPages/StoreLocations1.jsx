import React from "react";

export default function StoreLocations1() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-md-5 col-12">
            <div className="tf-store-list">
              <div className="tf-store-item">
                <h6 className="tf-store-title">New York Office</h6>
                <div className="tf-store-contact">
                  <div className="tf-store-info">
                    <p className="text-button">Phone:</p>
                    <p className="text-secondary">+1 666 234 8888</p>
                  </div>
                  <div className="tf-store-info">
                    <p className="text-button">Email:</p>
                    <p className="text-secondary">themesflat@gmail.com</p>
                  </div>
                </div>
                <div className="tf-store-address tf-store-info">
                  <p className="text-button">Address:</p>
                  <p className="text-secondary">
                    432 Park Avenue, New York, New York
                  </p>
                </div>
              </div>
              <div className="tf-store-item">
                <h6 className="tf-store-title">Houston Office</h6>
                <div className="tf-store-contact">
                  <div className="tf-store-info">
                    <p className="text-button">Phone:</p>
                    <p className="text-secondary">+1 713 432 8765</p>
                  </div>
                  <div className="tf-store-info">
                    <p className="text-button">Email:</p>
                    <p className="text-secondary">themesflat@gmail.com</p>
                  </div>
                </div>
                <div className="tf-store-address tf-store-info">
                  <p className="text-button">Address:</p>
                  <p className="text-secondary">
                    789 Main Street, Houston, Texas
                  </p>
                </div>
              </div>
              <div className="tf-store-item">
                <h6 className="tf-store-title">San Francisco Office</h6>
                <div className="tf-store-contact">
                  <div className="tf-store-info">
                    <p className="text-button">Phone:</p>
                    <p className="text-secondary">+1 415 987 6543</p>
                  </div>
                  <div className="tf-store-info">
                    <p className="text-button">Email:</p>
                    <p className="text-secondary">themesflat@gmail.com</p>
                  </div>
                </div>
                <div className="tf-store-address tf-store-info">
                  <p className="text-button">Address:</p>
                  <p className="text-secondary">
                    321 Market Street, San Francisco, California
                  </p>
                </div>
              </div>
              <div className="tf-store-item">
                <h6 className="tf-store-title">Miami Office</h6>
                <div className="tf-store-contact">
                  <div className="tf-store-info">
                    <p className="text-button">Phone:</p>
                    <p className="text-secondary">+1 305 543 2109</p>
                  </div>
                  <div className="tf-store-info">
                    <p className="text-button">Email:</p>
                    <p className="text-secondary">themesflat@gmail.com</p>
                  </div>
                </div>
                <div className="tf-store-address tf-store-info">
                  <p className="text-button">Address:</p>
                  <p className="text-secondary">
                    Address: 654 Ocean Drive, Miami, Florida
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-md-7 col-12">
            <div className="wrap-map">
              <div
                id="map-contact"
                className="map-contact"
                data-map-zoom={16}
                data-map-scroll="true"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.712380803123!2d-74.00594108459235!3d40.712775279328264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a3168ef8b1f%3A0xe28a875ee38c8ed1!2sNew+York%2C+NY%2C+USA!5e0!3m2!1sen!2s!4v1617203294845!5m2!1sen!2s"
                  width={600}
                  height={450}
                  style={{ border: 0, width: "100%", height: "100%" }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
