'use client';

import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ComposedChart, ResponsiveContainer } from 'recharts';

export default function Backtesting() {
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  });
  const [isRunning, setIsRunning] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [results, setResults] = useState({
    totalReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0
  });

  const calculateMetrics = (data) => {
    if (!data || data.length === 0) return;

    // Convert signals to numeric values
    const signalMapping = {
      'BUY': 1,
      'SELL': -1,
      'NONE': 0
    };

    const processedData = data.map((row, index) => ({
      ...row,
      signalValue: signalMapping[row.signal] || 0,
      dailyReturn: index > 0 ? (row.close - data[index - 1].close) / data[index - 1].close : 0
    }));

    // Calculate strategy returns
    const strategyReturns = processedData.map((row, index) => {
      if (index === processedData.length - 1) return 0;
      return row.signalValue * processedData[index + 1].dailyReturn;
    });

    // Calculate total return
    const totalReturn = strategyReturns.reduce((acc, return_) => (1 + acc) * (1 + return_) - 1, 0);

    // Calculate Sharpe ratio
    const riskFreeRate = 0.02 / 252; // Daily risk-free rate
    const excessReturns = strategyReturns.map(r => r - riskFreeRate);
    const meanExcessReturn = excessReturns.reduce((acc, val) => acc + val, 0) / excessReturns.length;
    const stdDev = Math.sqrt(
      excessReturns.reduce((acc, val) => acc + Math.pow(val - meanExcessReturn, 2), 0) / excessReturns.length
    );
    const sharpeRatio = meanExcessReturn / stdDev * Math.sqrt(252);

    // Calculate maximum drawdown
    let peak = -Infinity;
    let maxDrawdown = 0;
    let cumulativeReturn = 1;

    strategyReturns.forEach(return_ => {
      cumulativeReturn *= (1 + return_);
      peak = Math.max(peak, cumulativeReturn);
      const drawdown = (peak - cumulativeReturn) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    // Calculate win rate
    const wins = strategyReturns.filter(r => r > 0).length;
    const trades = processedData.filter(d => d.signalValue !== 0).length;
    const winRate = trades > 0 ? wins / trades : 0;

    setResults({
      totalReturn: (totalReturn * 100).toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2),
      maxDrawdown: (maxDrawdown * 100).toFixed(2),
      winRate: (winRate * 100).toFixed(1)
    });
  };

  const fetchBacktestData = async () => {
    try {
      const response = await fetch('/api/backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategy: selectedStrategy,
          startDate: dateRange.start,
          endDate: dateRange.end
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch backtest data');
      }

      const data = await response.json();
      
      // Format data for chart
      const formattedData = data.map((point, index) => ({
        index,
        close: point.Close,
        signal: point.Signal,
        buySignal: point.Signal === 'BUY' ? point.Close : null,
        sellSignal: point.Signal === 'SELL' ? point.Close : null
      }));

      setChartData(formattedData);
      calculateMetrics(formattedData);
    } catch (error) {
      console.error('Error fetching backtest data:', error);
      alert('Error fetching backtest data. Please try again.');
    }
  };

  const handleRunBacktest = async () => {
    if (!selectedStrategy) {
      alert('Please select a strategy');
      return;
    }
    setIsRunning(true);
    await fetchBacktestData();
    setIsRunning(false);
  };

  return (
    <div className="space-y-8" id="backtesting">
      <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Backtest Configuration</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Select Strategy</label>
                <select
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                >
                  <option value="">Select a strategy</option>
                  <option value="SMA">SMA Strategy</option>
                  <option value="RSI">RSI Strategy</option>
                  <option value="MACD">MACD Strategy</option>
                  <option value="BB">Bollinger Bands Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Start Date</label>
                <input
                  type="date"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">End Date</label>
                <input
                  type="date"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleRunBacktest}
                  disabled={isRunning || !selectedStrategy}
                  className="flex-1 flex items-center justify-center space-x-2 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning ? 'Running...' : 'Run Backtest'}</span>
                </button>

                <button 
                  onClick={() => {
                    setChartData([]);
                    setResults({
                      totalReturn: 0,
                      sharpeRatio: 0,
                      maxDrawdown: 0,
                      winRate: 0
                    });
                  }}
                  className="p-2 hover:bg-emerald-400/10 text-gray-400 hover:text-emerald-400 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100">Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm text-gray-400">Total Return</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {results.totalReturn > 0 ? '+' : ''}{results.totalReturn}%
                  </p>
                </div>
                <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm text-gray-400">Sharpe Ratio</p>
                  <p className="text-xl font-bold text-gray-100">{results.sharpeRatio}</p>
                </div>
                <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm text-gray-400">Max Drawdown</p>
                  <p className="text-xl font-bold text-red-400">{results.maxDrawdown}%</p>
                </div>
                <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm text-gray-400">Win Rate</p>
                  <p className="text-xl font-bold text-emerald-400">{results.winRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-[500px] bg-black/50 p-4 rounded-lg border border-gray-800">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="index"
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#8884d8"
                    dot={false}
                    name="Close Price"
                  />
                  <Scatter
                    dataKey="buySignal"
                    fill="#4ade80"
                    name="Buy Signal"
                  />
                  <Scatter
                    dataKey="sellSignal"
                    fill="#f87171"
                    name="Sell Signal"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Run backtest to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}