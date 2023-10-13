// LineChartComponent.tsx
"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const Line = dynamic(() => import('@ant-design/charts').then(({ Line }) => Line),
    { ssr: false }
);

interface DataPoint {
    x: string | number;
    y: string | number;
}

interface LineChartProps {
    data: DataPoint[];
    config?: any;
}

const JobChart: React.FC<LineChartProps> = ({ config }) => {
    const defaultConfig = {
        height: 400,
        ...config,
        slider: {
            start: 0,
            end: 1,
            // height: 50,
            trendCfg: {
                smooth: true
            }
        },
    };

    return <Line {...defaultConfig} />;
};

export default JobChart;
