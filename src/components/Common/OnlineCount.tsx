'use client';
import React, { useState, useEffect } from 'react';

interface OnlineCountProps {
    jobCount: number;
}

const OnlineCount: React.FC<OnlineCountProps> = ({ jobCount }) => {
    const [onlineUsers, setOnlineUsers] = useState<number>(0); // 初始化为0或其他固定值
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [today, setToday] = useState('');
    useEffect(() => {
        // 在组件挂载时设置初始的在线用户数
        setOnlineUsers(generateRandomNumber(500, 1000));

        // 更新在线用户数量的逻辑
        // const timer = setInterval(() => {
        const minutesDiff = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 60000); // minutes
        const min = Math.max(500, onlineUsers - minutesDiff * 10); // 这里你可以调整波动范围
        const max = Math.min(1000, onlineUsers + minutesDiff * 10);
        setOnlineUsers(generateRandomNumber(min, max));
        setLastUpdate(new Date());
        // }, 10000); // 每10秒钟更新一次在线用户数
        setToday(new Date().toISOString().split('T')[0])
        // return () => {
        //     clearInterval(timer);
        // };
    }, []);


    return (
        <div className='font-xl font-bold text-[#444] text-center'>
            Real-time tracking of 30,000+ companies, updated on: <span className='color-red'>{today}</span>, Found <span className='color-red'>{jobCount}</span> relevant job positions, <span className='color-red'>{onlineUsers}</span> people online.
        </div >
    );
};

// 生成一个在[min, max]范围内的随机整数
const generateRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default OnlineCount;
