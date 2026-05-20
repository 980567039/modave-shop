'use client'

import React, { useState, useRef } from 'react';
import Invoice from '../invoice-templates/invoice';


const CustomPrintComponent = () => {
  const [isPrinting, setIsPrinting] = useState(false);
  const printContentRef = useRef(null);

  const invoiceData = {
    invoiceNo: '#KS00106',
    orderNo: '#106',
    orderDate: '12/07/2022 13:26',
    shipper: {
      name: 'Nuvie',
      address: '#No. 744 Galle Road,Colombo 04',
      country: 'Sri Lanka',
      contact: '071 899 5566( 09.30 A.M to 6.00 P.M)'
    },
    receiver: {
      name: 'Dilrukshi Kumarage',
      company: '',
      location: 'Homagama,(10200)',
      mobile: '0711863943'
    },
    paymentMethod: 'COD',
    trackingNumber: 'Store Pickup - Liberty Plaza',
    shippingMethod: 'Deliver Shipping Service: KOOMBIYO',
    shippingCharges: 'LKR 480.00',
    items: [
      { sku: 'KS1086', description: 'Key Hole Sleeve Flared Mini Dress', price: 'LKR 2,390.00', quantity: 1, total: 'LKR 2,390.00' },
      { sku: 'KS1101', description: 'V neck Flared Crop Top', price: 'LKR 1,695.00', quantity: 1, total: 'LKR 1,695.00' },
      { sku: 'KS1103', description: 'Bishop Flared Smocked Blouse', price: 'LKR 2,395.00', quantity: 1, total: 'LKR 2,395.00' }
    ],
    subTotal: 'LKR 6,480.00',
    couponCode: 'FIRSTORDER',
    discount: 'LKR 1,296.00',
    netAmount: 'LKR 5,664.00'
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <>
      <style jsx global>{`
        @media screen {
          .printable-content {
            display: ${isPrinting ? 'block' : 'none'};
          }
        }
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 1.6cm;
          }
          body * {
            visibility: hidden;
          }
          .printable-content,
          .printable-content * {
            visibility: visible;
          }
          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        打印发票
      </button>
      <div className="printable-content">
        {/* <Invoice invoiceData={invoiceData} /> */}
      </div>

    </>
  );
};

export default CustomPrintComponent;