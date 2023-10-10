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
    };

    return <Line {...defaultConfig} />;
};

export default JobChart;
