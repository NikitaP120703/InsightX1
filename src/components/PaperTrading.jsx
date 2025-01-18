import React, { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { LineChart, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Papa from 'papaparse';
import _ from 'lodash';

// Stock options matching the Python code
const STOCK_OPTIONS = [
  { value: "TCS.NS", label: "TCS" },
  { value: "CIPLA.NS", label: "Cipla" },
  { value: "DRREDDY.NS", label: "Dr Reddy's" },
  { value: "HDFCBANK.NS", label: "HDFC Bank" },
  { value: "RELIANCE.NS", label: "Reliance" },
  { value: "BHARTIARTL.NS", label: "Bharti Airtel" },
  { value: "HUL.NS", label: "Hindustan Unilever" },
  { value: "TATASTEEL.NS", label: "Tata Steel" },
  { value: "DLF.NS", label: "DLF" },
  { value: "DMART.NS", label: "DMart" }
];

// Base prices for demo data generation
const BASE_PRICES = {
  'TCS.NS': 3500,
  'CIPLA.NS': 1200,
  'DRREDDY.NS': 5500,
  'HDFCBANK.NS': 1600,
  'RELIANCE.NS': 2400,
  'BHARTIARTL.NS': 850,
  'HUL.NS': 2500,
  'TATASTEEL.NS': 120,
  'DLF.NS': 450,
  'DMART.NS': 3800,
};

const TradingDashboard = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [selectedStock, setSelectedStock] = useState('TCS.NS');
  const [timeframe, setTimeframe] = useState('1D');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [target, setTarget] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [orderType, setOrderType] = useState('MARKET');
  const [trades, setTrades] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const resizeObserver = useRef(null);

  // Mock function to generate price data
  const generatePriceData = (symbol, days = 30) => {
    const data = [];
    let basePrice = BASE_PRICES[symbol] || 1000;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const volatility = basePrice * 0.02;
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = (open + high + low) / 3 + (Math.random() - 0.5) * volatility;
      
      basePrice = close;
      
      data.push({
        time: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
      });
    }
    
    return data;
  };

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#000000' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(75, 85, 99, 0.3)' },
        horzLines: { color: 'rgba(75, 85, 99, 0.3)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    const data = generatePriceData(selectedStock);
    candlestickSeries.setData(data);
    setCurrentPrice(data[data.length - 1].close.toFixed(2));

    resizeObserver.current = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });

    resizeObserver.current.observe(chartContainerRef.current);
    chartRef.current = { chart, candlestickSeries };

    return () => {
      chart.remove();
      resizeObserver.current?.disconnect();
    };
  }, []);

  // Update chart data when stock changes
  useEffect(() => {
    if (!chartRef.current) return;
    const newData = generatePriceData(selectedStock);
    chartRef.current.candlestickSeries.setData(newData);
    setCurrentPrice(newData[newData.length - 1].close.toFixed(2));
  }, [selectedStock]);

  // Handle trade execution
  const handleTrade = async (action) => {
    if (!quantity || !currentPrice) return;

    const tradeDetails = {
      symbol: selectedStock,
      quantity: parseInt(quantity),
      price: parseFloat(currentPrice),
      type: action,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      target: target ? parseFloat(target) : null,
      timestamp: new Date().toISOString(),
    };

    // Calculate take profit and stop loss prices
    const takeProfitPrice = tradeDetails.price * (1 + (tradeDetails.target || 0) / 100);
    const stopLossPrice = tradeDetails.price * (1 - (tradeDetails.stopLoss || 0) / 100);

    // Add trade to history
    setTrades(prev => [...prev, {
      ...tradeDetails,
      status: 'EXECUTED',
      takeProfitPrice,
      stopLossPrice
    }]);

    // Update positions
    if (action === 'BUY') {
      setPositions(prev => {
        const existingPosition = prev.find(p => p.symbol === selectedStock);
        if (existingPosition) {
          return prev.map(p => 
            p.symbol === selectedStock 
              ? {
                  ...p,
                  quantity: p.quantity + parseInt(quantity),
                  avgPrice: ((p.avgPrice * p.quantity) + (currentPrice * parseInt(quantity))) / (p.quantity + parseInt(quantity))
                }
              : p
          );
        }
        return [...prev, {
          symbol: selectedStock,
          quantity: parseInt(quantity),
          avgPrice: parseFloat(currentPrice),
          currentPrice: parseFloat(currentPrice)
        }];
      });
    } else {
      setPositions(prev => 
        prev.map(p => 
          p.symbol === selectedStock
            ? {
                ...p,
                quantity: p.quantity - parseInt(quantity)
              }
            : p
        ).filter(p => p.quantity > 0)
      );
    }

    // Clear form
    setQuantity('');
    setStopLoss('');
    setTarget('');
  };

  const calculateOrderValue = () => {
    return quantity ? (parseFloat(quantity) * parseFloat(currentPrice)).toFixed(2) : '0.00';
  };

  const cancelOrder = (trade) => {
    setTrades(prev => prev.map(t => 
      t.timestamp === trade.timestamp ? { ...t, status: 'CANCELLED' } : t
    ));
  };

  return (
    <div className="space-y-6 bg-black text-gray-200 p-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-100">
                ₹{positions.reduce((sum, pos) => sum + pos.quantity * pos.currentPrice, 0).toFixed(2)}
              </p>
            </div>
            <LineChart className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Open Positions</p>
              <p className="text-2xl font-bold text-gray-100">{positions.length}</p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Trades</p>
              <p className="text-2xl font-bold text-gray-100">{trades.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Chart and Trading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <select
                className="bg-black/50 border border-gray-800 rounded px-3 py-2 text-gray-300"
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
              >
                {STOCK_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="flex gap-2">
                {['15M', '1H', '1D'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded ${
                      timeframe === tf ? 'bg-blue-500' : 'bg-black/50 border border-gray-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div ref={chartContainerRef} className="w-full" />
          </div>
        </div>

        {/* Trading Panel */}
        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Current Price</label>
              <div className="text-xl font-bold text-gray-100">₹{currentPrice}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Order Type</label>
              <select
                className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-gray-300"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
              >
                <option value="MARKET">Market</option>
                <option value="LIMIT">Limit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-gray-300"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Stop Loss (%)</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-gray-300"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Enter stop loss %"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Target Profit (%)</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-gray-300"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Enter target %"
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Order Value</label>
              <div className="text-xl font-bold text-gray-100">₹{calculateOrderValue()}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => handleTrade('BUY')}
                className="bg-green-500 hover:bg-green-500/30 text-white px-4 py-2 rounded"
              >
                BUY
              </button>
              <button
                onClick={() => handleTrade('SELL')}
                className="bg-red-500 hover:bg-red-500/30 text-white px-4 py-2 rounded"
              >
                SELL
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Positions and Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Open Positions</h2>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div 
                key={index}
                className="flex flex-col bg-black/50 rounded-lg border border-gray-800 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-300">{position.symbol}</span>
                    <span className="text-sm text-gray-500">Qty: {position.quantity}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-semibold text-gray-300">₹{position.currentPrice.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Avg: ₹{position.avgPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">P&L:</span>
                    <span className={`text-sm font-semibold ${
                      position.currentPrice >= position.avgPrice ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      ₹{((position.currentPrice - position.avgPrice) * position.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${
                      position.currentPrice >= position.avgPrice ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {((position.currentPrice - position.avgPrice) / position.avgPrice * 100).toFixed(2)}%
                    </span>
                    <TrendingUp 
                      className={`w-4 h-4 ${
                        position.currentPrice >= position.avgPrice ? 'text-emerald-400' : 'text-red-400'
                      }`} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button 
                    onClick={() => handleTrade('BUY', position)}
                    className="px-3 py-2 text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => handleTrade('SELL', position)}
                    className="px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
            
            {positions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No open positions
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-100">Recent Orders</h2>
            <select 
              className="bg-black/50 border border-gray-800 rounded px-3 py-1 text-sm text-gray-300"
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {trades.filter(trade => {
              if (orderFilter === 'open') return trade.status === 'OPEN';
              if (orderFilter === 'closed') return trade.status === 'CLOSED';
              return true;
            }).slice(-5).map((trade, index) => (
              <div 
                key={index}
                className="flex flex-col bg-black/50 rounded-lg border border-gray-800 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-300">{trade.symbol}</span>
                    <span className="text-sm text-gray-500">Qty: {trade.quantity}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-semibold ${
                      trade.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {trade.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      @ ₹{trade.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1 mt-2">
                  {trade.target && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Target:</span>
                      <span className="text-emerald-400">₹{trade.takeProfitPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {trade.stopLoss && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Stop Loss:</span>
                      <span className="text-red-400">₹{trade.stopLossPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-gray-300">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                
                {trade.status === 'OPEN' && (
                  <button 
                    onClick={() => cancelOrder(trade)}
                    className="mt-4 px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
            
            {trades.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No recent orders
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;