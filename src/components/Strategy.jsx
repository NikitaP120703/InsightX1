'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, PlayCircle, LineChart, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const indicators = {
  'Moving Average': {
    params: {
      short_window: 50,
      long_window: 200
    }
  },
  'RSI': {
    params: {
      window: 14
    }
  },
  'MACD': {
    params: {
      short_window: 12,
      long_window: 26,
      signal_window: 9
    }
  },
  'Bollinger Bands': {
    params: {
      window: 20,
      std_dev: 2
    }
  },
  'Price Level': {
    params: {
      volume_multiplier: 1.5,
      lookback_period: 30
    }
  }
};

export default function Strategy() {
  const [strategies, setStrategies] = useState([]);
  const [backtestResults, setBacktestResults] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    ticker: '',
    selectedIndicators: [],
    indicatorParams: {},
    buyCondition: '',
    sellCondition: '',
    name: '',
  });

  // Function to parse conditions into an array
  const parseConditions = (conditionString) => {
    return conditionString.split(',').map(condition => condition.trim());
  };

  // Function to backtest strategy
  const backtestStrategy = async (strategy) => {
    try {
      setIsBacktesting(true);
      
      // Read the CSV file with indicator data
      const response = await window.fs.readFile('strategy_with_indicators.csv', { encoding: 'utf8' });
      const parsed = Papa.parse(response, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      let data = parsed.data;
      
      // Drop first two records and reset index
      data = data.slice(2);
      
      // Process signals based on conditions
      const buyConditions = parseConditions(strategy.conditions.buy);
      const sellConditions = parseConditions(strategy.conditions.sell);
      
      const processedData = data.map((row, index) => {
        const buyEval = buyConditions.every(condition => {
          try {
            // Create a context with row data
            const context = { ...row };
            // Evaluate the condition
            return eval(condition.replace(/\${(\w+)}/g, (_, key) => context[key]));
          } catch (error) {
            console.error('Error evaluating buy condition:', error);
            return false;
          }
        });

        const sellEval = sellConditions.every(condition => {
          try {
            const context = { ...row };
            return eval(condition.replace(/\${(\w+)}/g, (_, key) => context[key]));
          } catch (error) {
            console.error('Error evaluating sell condition:', error);
            return false;
          }
        });

        return {
          ...row,
          signal: buyEval ? 'BUY' : (sellEval ? 'SELL' : null)
        };
      });

      // Calculate performance metrics
      let buyPoints = [];
      let sellPoints = [];
      let trades = [];
      let position = null;

      processedData.forEach((row, index) => {
        if (row.signal === 'BUY' && !position) {
          position = { entry: row.Close, entryDate: row.Date };
          buyPoints.push(index);
        } else if (row.signal === 'SELL' && position) {
          const exit = row.Close;
          const profit = exit - position.entry;
          trades.push({
            entry: position.entry,
            exit: exit,
            profit: profit,
            profitPercent: (profit / position.entry) * 100,
            entryDate: position.entryDate,
            exitDate: row.Date
          });
          position = null;
          sellPoints.push(index);
        }
      });

      // Calculate performance metrics
      const totalTrades = trades.length;
      const profitableTrades = trades.filter(t => t.profit > 0).length;
      const winRate = (profitableTrades / totalTrades) * 100;
      const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
      const averageProfit = totalProfit / totalTrades;

      setBacktestResults({
        trades,
        buyPoints,
        sellPoints,
        metrics: {
          totalTrades,
          profitableTrades,
          winRate,
          totalProfit,
          averageProfit
        },
        chartData: processedData
      });

    } catch (error) {
      console.error('Backtesting error:', error);
    } finally {
      setIsBacktesting(false);
    }
  };

  const handleCreateStrategy = () => {
    if (!newStrategy.name || !newStrategy.ticker) {
      return;
    }

    const strategy = {
      id: Date.now().toString(),
      name: newStrategy.name,
      ticker: newStrategy.ticker,
      indicators: newStrategy.selectedIndicators,
      indicatorParams: newStrategy.indicatorParams,
      conditions: {
        buy: newStrategy.buyCondition,
        sell: newStrategy.sellCondition,
      },
    };

    setStrategies([...strategies, strategy]);
    setNewStrategy({
      ticker: '',
      selectedIndicators: [],
      indicatorParams: {},
      buyCondition: '',
      sellCondition: '',
      name: '',
    });
  };

  const handleDeleteStrategy = (id) => {
    setStrategies(strategies.filter(s => s.id !== id));
    if (selectedStrategy?.id === id) {
      setSelectedStrategy(null);
      setBacktestResults(null);
    }
  };

  const handleIndicatorSelect = (indicatorName, checked) => {
    const updatedIndicators = checked
      ? [...newStrategy.selectedIndicators, indicatorName]
      : newStrategy.selectedIndicators.filter(i => i !== indicatorName);

    const updatedParams = { ...newStrategy.indicatorParams };
    if (checked) {
      updatedParams[indicatorName] = { ...indicators[indicatorName].params };
    } else {
      delete updatedParams[indicatorName];
    }

    setNewStrategy({
      ...newStrategy,
      selectedIndicators: updatedIndicators,
      indicatorParams: updatedParams
    });
  };

  const handleParamChange = (indicatorName, paramName, value) => {
    setNewStrategy({
      ...newStrategy,
      indicatorParams: {
        ...newStrategy.indicatorParams,
        [indicatorName]: {
          ...newStrategy.indicatorParams[indicatorName],
          [paramName]: Number(value)
        }
      }
    });
  };

  // Function to download strategies as JSON
  const downloadStrategies = () => {
    const dataStr = JSON.stringify(strategies, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'strategies.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8" id="strategy">
      {/* Strategy Creator Section */}
      <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Strategy Creator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Strategy Name</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20"
                value={newStrategy.name}
                onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                placeholder="Enter strategy name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Ticker Symbol</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20"
                value={newStrategy.ticker}
                onChange={(e) => setNewStrategy({ ...newStrategy, ticker: e.target.value })}
                placeholder="e.g., AAPL"
              />
            </div>

            {/* Indicators Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Indicators</label>
              <div className="space-y-4">
                {Object.entries(indicators).map(([indicatorName, indicator]) => (
                  <div key={indicatorName} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={indicatorName}
                        checked={newStrategy.selectedIndicators.includes(indicatorName)}
                        onChange={(e) => handleIndicatorSelect(indicatorName, e.target.checked)}
                        className="rounded border-gray-700 bg-black/50 text-emerald-400 focus:ring-emerald-400/20"
                      />
                      <label htmlFor={indicatorName} className="text-gray-300">{indicatorName}</label>
                    </div>
                    
                    {newStrategy.selectedIndicators.includes(indicatorName) && (
                      <div className="ml-6 space-y-2">
                        {Object.entries(indicator.params).map(([paramName, defaultValue]) => (
                          <div key={paramName} className="flex items-center space-x-2">
                            <label className="text-sm text-gray-400 w-32">{paramName}:</label>
                            <input
                              type="number"
                              value={newStrategy.indicatorParams[indicatorName]?.[paramName] ?? defaultValue}
                              onChange={(e) => handleParamChange(indicatorName, paramName, e.target.value)}
                              className="w-24 bg-black/50 border border-gray-800 rounded px-2 py-1 text-gray-200"
                              step="any"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Buy Conditions</label>
              <div className="mb-2 text-xs text-gray-500">
                Use format: SMA_long {'>'} SMA_short, RSI {'<'} 30
              </div>
              <textarea
                className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20"
                value={newStrategy.buyCondition}
                onChange={(e) => setNewStrategy({ ...newStrategy, buyCondition: e.target.value })}
                placeholder="Enter buy conditions"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Sell Conditions</label>
              <div className="mb-2 text-xs text-gray-500">
                Use format: SMA_long {'<'} SMA_short, RSI {'>'} 70
              </div>
              <textarea
                className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20"
                value={newStrategy.sellCondition}
                onChange={(e) => setNewStrategy({ ...newStrategy, sellCondition: e.target.value })}
                placeholder="Enter sell conditions"
                rows={3}
              />
            </div>

            <button
              onClick={handleCreateStrategy}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Strategy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strategies List Section */}
      <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">My Strategies</h2>
        <div className="grid gap-4">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-black/50 border border-gray-800 rounded-lg p-4 ${
                selectedStrategy?.id === strategy.id ? 'border-emerald-400/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{strategy.name}</h3>
                  <p className="text-sm text-gray-400">{strategy.ticker}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedStrategy(strategy);
                      backtestStrategy(strategy);
                    }}
                    disabled={isBacktesting}
                    className="p-2 hover:bg-blue-400/10 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 hover:bg-emerald-400/10 text-gray-400 hover:text-emerald-400 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStrategy(strategy.id)}
                    className="p-2 hover:bg-red-400/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="space-y-2">
                  {strategy.indicators.map((indicator) => (
                    <div key={indicator} className="text-sm text-gray-300">
                      <span className="font-medium">{indicator}:</span>{' '}
                      {Object.entries(strategy.indicatorParams[indicator]).map(([param, value], idx) => (
                        <span key={param}>
                          {param}: {value}
                          {idx < Object.entries(strategy.indicatorParams[indicator]).length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Buy:</span> {strategy.conditions.buy}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Sell:</span> {strategy.conditions.sell}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <button
          onClick={downloadStrategies}
          className="mt-4 flex items-center justify-center space-x-2 bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Strategies</span>
        </button>
      </div>

      {/* Backtesting Results Section */}
      {backtestResults && (
        <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Backtesting Results</h2>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Total Trades</p>
              <p className="text-2xl font-bold text-gray-100">
                {backtestResults.metrics.totalTrades}
              </p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-emerald-400">
                {backtestResults.metrics.winRate.toFixed(2)}%
              </p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Total Profit</p>
              <p className={`text-2xl font-bold ${
                backtestResults.metrics.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                ₹{backtestResults.metrics.totalProfit.toFixed(2)}
              </p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Average Profit/Trade</p>
              <p className={`text-2xl font-bold ${
                backtestResults.metrics.averageProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                ₹{backtestResults.metrics.averageProfit.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-black/50 p-4 rounded-lg border border-gray-800 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Performance Chart</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={backtestResults.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="Date"
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                    itemStyle={{ color: '#9ca3af' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Close" 
                    stroke="#10b981" 
                    dot={false}
                    name="Price"
                  />
                  {backtestResults.buyPoints.map((point, index) => (
                    <Line
                      key={`buy-${index}`}
                      type="monotone"
                      dataKey="Close"
                      dot={{
                        r: 4,
                        fill: '#10b981',
                        stroke: '#10b981',
                      }}
                      activeDot={false}
                      stroke="none"
                      data={[backtestResults.chartData[point]]}
                      name="Buy Signal"
                    />
                  ))}
                  {backtestResults.sellPoints.map((point, index) => (
                    <Line
                      key={`sell-${index}`}
                      type="monotone"
                      dataKey="Close"
                      dot={{
                        r: 4,
                        fill: '#ef4444',
                        stroke: '#ef4444',
                      }}
                      activeDot={false}
                      stroke="none"
                      data={[backtestResults.chartData[point]]}
                      name="Sell Signal"
                    />
                  ))}
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trade List */}
          <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Trade History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left">
                  <tr className="text-gray-400">
                    <th className="pb-3">Entry Date</th>
                    <th className="pb-3">Exit Date</th>
                    <th className="pb-3">Entry Price</th>
                    <th className="pb-3">Exit Price</th>
                    <th className="pb-3">Profit</th>
                    <th className="pb-3">Return %</th>
                  </tr>
                </thead>
                <tbody>
                  {backtestResults.trades.map((trade, index) => (
                    <tr key={index} className="border-t border-gray-800">
                      <td className="py-2 text-gray-300">
                        {new Date(trade.entryDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-gray-300">
                        {new Date(trade.exitDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-gray-300">₹{trade.entry.toFixed(2)}</td>
                      <td className="py-2 text-gray-300">₹{trade.exit.toFixed(2)}</td>
                      <td className={`py-2 ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ₹{trade.profit.toFixed(2)}
                      </td>
                      <td className={`py-2 ${trade.profitPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.profitPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}