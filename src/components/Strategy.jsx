'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [newStrategy, setNewStrategy] = useState({
    ticker: '',
    selectedIndicators: [],
    indicatorParams: {},
    buyCondition: '',
    sellCondition: '',
    name: '',
  });

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

  return (
    <div className="space-y-8" id="strategy">
      <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Strategy Creator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Buy Condition</label>
              <textarea
                className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20"
                value={newStrategy.buyCondition}
                onChange={(e) => setNewStrategy({ ...newStrategy, buyCondition: e.target.value })}
                placeholder="Enter buy condition"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Sell Condition</label>
              <textarea
                className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20"
                value={newStrategy.sellCondition}
                onChange={(e) => setNewStrategy({ ...newStrategy, sellCondition: e.target.value })}
                placeholder="Enter sell condition"
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

      <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">My Strategies</h2>
        <div className="grid gap-4">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{strategy.name}</h3>
                  <p className="text-sm text-gray-400">{strategy.ticker}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-emerald-400/10 text-gray-400 hover:text-emerald-400 rounded-lg transition-colors">
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
      </div>
    </div>
  );
}