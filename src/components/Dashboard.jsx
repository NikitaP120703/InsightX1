'use client';

import React, { useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { LineChart, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const generateDummyData = () => {
  const data = [];
  let currentPrice = 100;
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const open = currentPrice;
    const high = open + Math.random() * 5;
    const low = open - Math.random() * 5;
    const close = low + Math.random() * (high - low);
    
    data.push({
      time: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    });
    
    currentPrice = close;
  }
  
  return data;
};

export default function Dashboard() {
  const [chartInstance, setChartInstance] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const chartContainer = document.getElementById('chart');
    if (chartContainer) {
      const chart = createChart(chartContainer, {
        layout: {
          background: { type: 'solid', color: '#000000' },
          textColor: '#9ca3af',
        },
        grid: {
          vertLines: { color: 'rgba(75, 85, 99, 0.3)' },
          horzLines: { color: 'rgba(75, 85, 99, 0.3)' },
        },
        width: chartContainer.clientWidth,
        height: 400,
        crosshair: {
          mode: 'normal',
          vertLine: {
            color: '#9ca3af',
            width: 1,
            style: 3,
            visible: true,
            labelVisible: true,
          },
          horzLine: {
            color: '#9ca3af',
            width: 1,
            style: 3,
            visible: true,
            labelVisible: true,
          },
        },
        timeScale: {
          timeVisible: true,
          borderColor: 'rgba(75, 85, 99, 0.3)',
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      const dummyData = generateDummyData();
      candlestickSeries.setData(dummyData);

      setChartInstance(chart);

      const handleResize = () => {
        const newWidth = chartContainer.clientWidth;
        chart.applyOptions({ width: newWidth });
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  const strategies = [
    { name: 'RSI Reversal', status: 'Active', performance: '+8.2%' },
    { name: 'MACD Crossover', status: 'Active', performance: '+5.7%' },
    { name: 'Moving Average Strategy', status: 'Active', performance: '+3.9%' }
  ];

  const recentTrades = [
    { symbol: 'AAPL', type: 'Buy', price: '$175.34', time: '2 min ago' },
    { symbol: 'TSLA', type: 'Sell', price: '$242.68', time: '5 min ago' },
    { symbol: 'MSFT', type: 'Buy', price: '$328.79', time: '15 min ago' },
  ];

  return (
    <div className="space-y-6 bg-black text-gray-200" id="dashboard">
      <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">Market Overview</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
              1D
            </button>
            <button className="px-3 py-1 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
              1W
            </button>
            <button className="px-3 py-1 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
              1M
            </button>
          </div>
        </div>
        <div id="chart" className="w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-100">Active Strategies</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {strategies.map((strategy) => (
              <div
                key={strategy.name}
                className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-gray-300">{strategy.name}</span>
                  <div className="text-sm text-emerald-400">{strategy.performance}</div>
                </div>
                <span className="text-emerald-400 text-sm px-2 py-1 rounded-full bg-emerald-400/10">
                  {strategy.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-100">Recent Trades</h2>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentTrades.map((trade) => (
              <div
                key={trade.symbol}
                className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-gray-300">{trade.symbol}</span>
                  <div className="text-sm text-gray-400">{trade.time}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {trade.type === 'Buy' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={trade.type === 'Buy' ? 'text-emerald-400' : 'text-red-400'}>
                    {trade.type} @ {trade.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}