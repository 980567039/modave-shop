"use client";
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';

// const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function RevenueByCategory() {
    const [isClient, setIsClient] = useState(false);

    var options = {
        series: [{
            data: [400, 430, 448]
        }],
        chart: {
            type: 'bar',
            height: 400,
            toolbar: {
                show: false // Hide the toolbar
            },
            
            parentHeightOffset: 0, // Remove parent height offset
        },
        fill:{
            colors: ['#7A70BA']
        },
        plotOptions: {
            bar: {
                borderRadius: 20,
                borderRadiusApplication: 'end',
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Dress', 'Top', 'Kids'],
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    return (
        <div>
            {/* <ReactApexChart
                options={options.options}
                series={options.series}
                type="bar"
                width="100%"
                height={400}
            /> */}
        </div>
    )
}
