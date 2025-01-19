import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ComposedChart, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

// Hardcoded data from the CSV file
const hardcodedData = [
  { date: '2020-10-21', close: 11937.650390625, signal: 'SELL' },
  { date: '2020-10-22', close: 11896.4501953125, signal: 'SELL' },
  { date: '2020-11-10', close: 12631.099609375, signal: 'SELL' },
  { date: '2020-11-11', close: 12749.150390625, signal: 'SELL' },
  { date: '2020-11-12', close: 12690.7998046875, signal: 'SELL' },
  { date: '2020-11-13', close: 12719.9501953125, signal: 'SELL' },
  { date: '2020-11-17', close: 12874.2001953125, signal: 'SELL' },
  { date: '2020-11-18', close: 12938.25, signal: 'SELL' },
  { date: '2020-11-19', close: 12771.7001953125, signal: 'SELL' },
  { date: '2020-11-20', close: 12859.0498046875, signal: 'SELL' },
  { date: '2020-11-23', close: 12926.4501953125, signal: 'SELL' },
  { date: '2020-11-24', close: 13055.150390625, signal: 'SELL' },
  { date: '2020-11-25', close: 12858.400390625, signal: 'SELL' },
  { date: '2020-11-26', close: 12987.0, signal: 'SELL' },
  { date: '2020-11-27', close: 12968.9501953125, signal: 'SELL' },
  { date: '2020-12-01', close: 13109.0498046875, signal: 'SELL' },
  { date: '2020-12-04', close: 13258.5498046875, signal: 'SELL' },
  { date: '2020-12-07', close: 13355.75, signal: 'SELL' },
  { date: '2020-12-08', close: 13392.9501953125, signal: 'SELL' },
  { date: '2020-12-09', close: 13529.099609375, signal: 'SELL' },
  { date: '2020-12-10', close: 13478.2998046875, signal: 'SELL' },
  { date: '2020-12-11', close: 13513.849609375, signal: 'SELL' },
  { date: '2020-12-14', close: 13558.150390625, signal: 'SELL' },
  { date: '2020-12-15', close: 13567.849609375, signal: 'SELL' },
  { date: '2020-12-16', close: 13682.7001953125, signal: 'SELL' },
  { date: '2020-12-17', close: 13740.7001953125, signal: 'SELL' },
  { date: '2020-12-18', close: 13760.5498046875, signal: 'SELL' },
  { date: '2021-01-05', close: 14199.5, signal: 'SELL' },
  { date: '2021-01-11', close: 14484.75, signal: 'SELL' },
  { date: '2021-01-12', close: 14563.4501953125, signal: 'SELL' },
  { date: '2021-01-13', close: 14564.849609375, signal: 'SELL' },
  { date: '2021-01-14', close: 14595.599609375, signal: 'SELL' },
  { date: '2021-01-15', close: 14433.7001953125, signal: 'SELL' },
  { date: '2021-01-19', close: 14521.150390625, signal: 'SELL' },
  { date: '2021-01-20', close: 14644.7001953125, signal: 'SELL' },
  { date: '2021-02-15', close: 15314.7001953125, signal: 'SELL' },
  { date: '2021-02-16', close: 15313.4501953125, signal: 'SELL' },
  { date: '2021-02-17', close: 15208.900390625, signal: 'SELL' },
  { date: '2021-02-18', close: 15118.9501953125, signal: 'SELL' },
  { date: '2021-02-19', close: 14981.75, signal: 'SELL' },
  { date: '2021-05-25', close: 15208.4501953125, signal: 'SELL' },
  { date: '2021-05-26', close: 15301.4501953125, signal: 'SELL' },
  { date: '2021-05-31', close: 15582.7998046875, signal: 'SELL' },
  { date: '2021-06-01', close: 15574.849609375, signal: 'SELL' },
  { date: '2021-06-02', close: 15576.2001953125, signal: 'SELL' },
  { date: '2021-06-03', close: 15690.349609375, signal: 'SELL' },
  { date: '2021-06-04', close: 15670.25, signal: 'SELL' },
  { date: '2021-06-07', close: 15751.650390625, signal: 'SELL' },
  { date: '2021-06-08', close: 15740.099609375, signal: 'SELL' },
  { date: '2021-06-09', close: 15635.349609375, signal: 'SELL' },
  { date: '2021-06-10', close: 15737.75, signal: 'SELL' },
  { date: '2021-06-11', close: 15799.349609375, signal: 'SELL' },
  { date: '2021-06-14', close: 15811.849609375, signal: 'SELL' },
  { date: '2021-06-15', close: 15869.25, signal: 'SELL' },
  { date: '2021-06-16', close: 15767.5498046875, signal: 'SELL' },
  { date: '2021-08-09', close: 16258.25, signal: 'SELL' },
  { date: '2021-08-10', close: 16280.099609375, signal: 'SELL' },
  { date: '2021-08-11', close: 16282.25, signal: 'SELL' },
  { date: '2021-08-12', close: 16364.400390625, signal: 'SELL' },
  { date: '2021-08-13', close: 16529.099609375, signal: 'SELL' },
  { date: '2021-08-16', close: 16563.05078125, signal: 'SELL' },
  { date: '2021-08-17', close: 16614.599609375, signal: 'SELL' },
  { date: '2021-08-18', close: 16568.849609375, signal: 'SELL' },
  { date: '2021-08-20', close: 16450.5, signal: 'SELL' },
  { date: '2021-08-23', close: 16496.44921875, signal: 'SELL' },
  { date: '2021-08-24', close: 16624.599609375, signal: 'SELL' },
  { date: '2021-08-25', close: 16634.650390625, signal: 'SELL' },
  { date: '2021-08-26', close: 16636.900390625, signal: 'SELL' },
  { date: '2021-08-27', close: 16705.19921875, signal: 'SELL' },
  { date: '2021-08-30', close: 16931.05078125, signal: 'SELL' },
  { date: '2021-08-31', close: 17132.19921875, signal: 'SELL' },
  { date: '2021-09-01', close: 17076.25, signal: 'SELL' },
  { date: '2021-09-02', close: 17234.150390625, signal: 'SELL' },
  { date: '2021-09-03', close: 17323.599609375, signal: 'SELL' },
  { date: '2021-09-06', close: 17377.80078125, signal: 'SELL' },
  { date: '2021-09-07', close: 17362.099609375, signal: 'SELL' },
  { date: '2021-09-08', close: 17353.5, signal: 'SELL' },
  { date: '2021-09-09', close: 17369.25, signal: 'SELL' },
  { date: '2021-09-13', close: 17355.30078125, signal: 'SELL' },
  { date: '2021-09-14', close: 17380.0, signal: 'SELL' },
  { date: '2021-09-15', close: 17519.44921875, signal: 'SELL' },
  { date: '2021-09-16', close: 17629.5, signal: 'SELL' },
  { date: '2021-09-17', close: 17585.150390625, signal: 'SELL' },
  { date: '2021-09-20', close: 17396.900390625, signal: 'SELL' },
  { date: '2021-09-22', close: 17546.650390625, signal: 'SELL' },
  { date: '2021-09-23', close: 17822.94921875, signal: 'SELL' },
  { date: '2021-09-24', close: 17853.19921875, signal: 'SELL' },
  { date: '2021-09-27', close: 17855.099609375, signal: 'SELL' },
  { date: '2021-10-19', close: 18418.75, signal: 'SELL' },
  { date: '2021-10-27', close: 18210.94921875, signal: 'SELL' },
  { date: '2022-01-07', close: 17812.69921875, signal: 'SELL' },
  { date: '2022-01-10', close: 18003.30078125, signal: 'SELL' },
  { date: '2022-01-11', close: 18055.75, signal: 'SELL' },
  { date: '2022-01-12', close: 18212.349609375, signal: 'SELL' },
  { date: '2022-01-13', close: 18257.80078125, signal: 'SELL' },
  { date: '2022-01-14', close: 18255.75, signal: 'SELL' },
  { date: '2022-01-17', close: 18308.099609375, signal: 'SELL' },
  { date: '2022-01-18', close: 18113.05078125, signal: 'SELL' },
  { date: '2022-03-28', close: 17222.0, signal: 'SELL' },
  { date: '2022-03-29', close: 17325.30078125, signal: 'SELL' },
  { date: '2022-03-30', close: 17498.25, signal: 'SELL' },
  { date: '2022-03-31', close: 17464.75, signal: 'SELL' },
  { date: '2022-04-01', close: 17670.44921875, signal: 'SELL' },
  { date: '2022-04-04', close: 18053.400390625, signal: 'SELL' },
  { date: '2022-04-05', close: 17957.400390625, signal: 'SELL' },
  { date: '2022-04-06', close: 17807.650390625, signal: 'SELL' },
  { date: '2022-05-11', close: 16167.099609375, signal: 'BUY' },
  { date: '2022-05-12', close: 15808.0, signal: 'BUY' },
  { date: '2022-05-13', close: 15782.150390625, signal: 'BUY' },
  { date: '2022-05-16', close: 15842.2998046875, signal: 'BUY' },
  { date: '2022-05-17', close: 16259.2998046875, signal: 'BUY' },
  { date: '2022-05-19', close: 15809.400390625, signal: 'BUY' },
  { date: '2022-06-16', close: 15360.599609375, signal: 'BUY' },
  { date: '2022-06-17', close: 15293.5, signal: 'BUY' },
  { date: '2022-06-20', close: 15350.150390625, signal: 'BUY' },
  { date: '2022-06-21', close: 15638.7998046875, signal: 'BUY' },
  { date: '2022-06-22', close: 15413.2998046875, signal: 'BUY' },
  { date: '2022-06-23', close: 15556.650390625, signal: 'BUY' },
  { date: '2022-10-24', close: 17730.75, signal: 'SELL' },
  { date: '2022-10-31', close: 18012.19921875, signal: 'SELL' },
  { date: '2022-11-01', close: 18145.400390625, signal: 'SELL' },
  { date: '2022-11-02', close: 18082.849609375, signal: 'SELL' },
  { date: '2022-11-03', close: 18052.69921875, signal: 'SELL' },
  { date: '2022-11-04', close: 18117.150390625, signal: 'SELL' },
  { date: '2022-11-07', close: 18202.80078125, signal: 'SELL' },
  { date: '2022-11-09', close: 18157.0, signal: 'SELL' },
  { date: '2022-11-10', close: 18028.19921875, signal: 'SELL' },
  { date: '2022-11-11', close: 18349.69921875, signal: 'SELL' },
  { date: '2022-11-14', close: 18329.150390625, signal: 'SELL' },
  { date: '2022-11-15', close: 18403.400390625, signal: 'SELL' },
  { date: '2022-11-16', close: 18409.650390625, signal: 'SELL' },
  { date: '2022-11-17', close: 18343.900390625, signal: 'SELL' },
  { date: '2022-11-18', close: 18307.650390625, signal: 'SELL' },
  { date: '2022-11-30', close: 18758.349609375, signal: 'SELL' },
  { date: '2022-12-01', close: 18812.5, signal: 'SELL' },
  { date: '2023-02-16', close: 18035.849609375, signal: 'SELL' },
  { date: '2023-04-06', close: 17599.150390625, signal: 'SELL' },
  { date: '2023-06-06', close: 18599.0, signal: 'SELL' },
  { date: '2023-06-07', close: 18726.400390625, signal: 'SELL' },
  { date: '2023-06-08', close: 18634.55078125, signal: 'SELL' },
  { date: '2023-06-13', close: 18716.150390625, signal: 'SELL' },
  { date: '2023-06-14', close: 18755.900390625, signal: 'SELL' },
  { date: '2023-06-30', close: 19189.05078125, signal: 'SELL' },
  { date: '2023-07-03', close: 19322.55078125, signal: 'SELL' },
  { date: '2023-07-04', close: 19389.0, signal: 'SELL' },
  { date: '2023-07-05', close: 19398.5, signal: 'SELL' },
  { date: '2023-07-06', close: 19497.30078125, signal: 'SELL' },
  { date: '2023-07-10', close: 19355.900390625, signal: 'SELL' },
  { date: '2023-07-11', close: 19439.400390625, signal: 'SELL' },
  { date: '2023-07-13', close: 19413.75, signal: 'SELL' },
  { date: '2023-07-14', close: 19564.5, signal: 'SELL' },
  { date: '2023-07-17', close: 19711.44921875, signal: 'SELL' },
  { date: '2023-07-18', close: 19749.25, signal: 'SELL' },
  { date: '2023-07-19', close: 19833.150390625, signal: 'SELL' },
  { date: '2023-07-20', close: 19979.150390625, signal: 'SELL' },
  { date: '2023-09-07', close: 19727.05078125, signal: 'SELL' },
  { date: '2023-09-08', close: 19819.94921875, signal: 'SELL' },
  { date: '2023-09-11', close: 19996.349609375, signal: 'SELL' },
  { date: '2023-09-12', close: 19993.19921875, signal: 'SELL' },
  { date: '2023-09-13', close: 20070.0, signal: 'SELL' },
  { date: '2023-09-14', close: 20103.099609375, signal: 'SELL' },
  { date: '2023-09-15', close: 20192.349609375, signal: 'SELL' },
  { date: '2023-09-18', close: 20133.30078125, signal: 'SELL' },
  { date: '2023-09-20', close: 19901.400390625, signal: 'SELL' },
  { date: '2023-11-16', close: 19765.19921875, signal: 'SELL' },
  { date: '2023-11-17', close: 19731.80078125, signal: 'SELL' },
  { date: '2023-11-20', close: 19694.0, signal: 'SELL' },
  { date: '2023-11-21', close: 19783.400390625, signal: 'SELL' },
  { date: '2023-11-22', close: 19811.849609375, signal: 'SELL' },
  { date: '2023-11-23', close: 19802.0, signal: 'SELL' },
  { date: '2023-11-24', close: 19794.69921875, signal: 'SELL' },
  { date: '2023-11-28', close: 19889.69921875, signal: 'SELL' },
  { date: '2023-11-29', close: 20096.599609375, signal: 'SELL' },
  { date: '2023-11-30', close: 20133.150390625, signal: 'SELL' },
  { date: '2023-12-01', close: 20267.900390625, signal: 'SELL' },
  { date: '2023-12-04', close: 20686.80078125, signal: 'SELL' },
  { date: '2023-12-05', close: 20855.099609375, signal: 'SELL' },
  { date: '2023-12-06', close: 20937.69921875, signal: 'SELL' },
  { date: '2023-12-07', close: 20901.150390625, signal: 'SELL' },
  { date: '2023-12-08', close: 20969.400390625, signal: 'SELL' },
  { date: '2023-12-11', close: 20997.099609375, signal: 'SELL' },
  { date: '2023-12-12', close: 20906.400390625, signal: 'SELL' },
  { date: '2023-12-13', close: 20926.349609375, signal: 'SELL' },
  { date: '2023-12-14', close: 21182.69921875, signal: 'SELL' },
  { date: '2023-12-15', close: 21456.650390625, signal: 'SELL' },
  { date: '2023-12-18', close: 21418.650390625, signal: 'SELL' },
  { date: '2023-12-19', close: 21453.099609375, signal: 'SELL' },
  { date: '2023-12-20', close: 21150.150390625, signal: 'SELL' },
  { date: '2023-12-21', close: 21255.05078125, signal: 'SELL' },
  { date: '2023-12-22', close: 21349.400390625, signal: 'SELL' },
  { date: '2023-12-27', close: 21654.75, signal: 'SELL' },
  { date: '2023-12-28', close: 21778.69921875, signal: 'SELL' },
  { date: '2023-12-29', close: 21731.400390625, signal: 'SELL' },
  { date: '2024-01-01', close: 21741.900390625, signal: 'SELL' },
  { date: '2024-01-02', close: 21665.80078125, signal: 'SELL' },
  { date: '2024-01-15', close: 22097.44921875, signal: 'SELL' },
  { date: '2024-03-01', close: 22338.75, signal: 'SELL' },
  { date: '2024-03-04', close: 22405.599609375, signal: 'SELL' },
  { date: '2024-04-08', close: 22666.30078125, signal: 'SELL' },
  { date: '2024-04-09', close: 22642.75, signal: 'SELL' },
  { date: '2024-04-10', close: 22753.80078125, signal: 'SELL' },
  { date: '2024-04-12', close: 22519.400390625, signal: 'SELL' },
  { date: '2024-06-03', close: 23263.900390625, signal: 'SELL' },
  { date: '2024-06-25', close: 23721.30078125, signal: 'SELL' },
  { date: '2024-06-26', close: 23868.80078125, signal: 'SELL' },
  { date: '2024-06-27', close: 24044.5, signal: 'SELL' },
  { date: '2024-06-28', close: 24010.599609375, signal: 'SELL' },
  { date: '2024-07-01', close: 24141.94921875, signal: 'SELL' },
  { date: '2024-07-02', close: 24123.849609375, signal: 'SELL' },
  { date: '2024-07-03', close: 24286.5, signal: 'SELL' },
  { date: '2024-07-04', close: 24302.150390625, signal: 'SELL' },
  { date: '2024-07-05', close: 24323.849609375, signal: 'SELL' },
  { date: '2024-07-08', close: 24320.55078125, signal: 'SELL' },
  { date: '2024-07-09', close: 24433.19921875, signal: 'SELL' },
  { date: '2024-07-10', close: 24324.44921875, signal: 'SELL' },
  { date: '2024-07-11', close: 24315.94921875, signal: 'SELL' },
  { date: '2024-07-12', close: 24502.150390625, signal: 'SELL' },
  { date: '2024-07-15', close: 24586.69921875, signal: 'SELL' },
  { date: '2024-07-16', close: 24613.0, signal: 'SELL' },
  { date: '2024-07-18', close: 24800.849609375, signal: 'SELL' },
  { date: '2024-07-31', close: 24951.150390625, signal: 'SELL' },
  { date: '2024-08-01', close: 25010.900390625, signal: 'SELL' },
  { date: '2024-08-26', close: 25010.599609375, signal: 'SELL' },
  { date: '2024-08-27', close: 25017.75, signal: 'SELL' },
  { date: '2024-08-28', close: 25052.349609375, signal: 'SELL' },
  { date: '2024-08-29', close: 25151.94921875, signal: 'SELL' },
  { date: '2024-08-30', close: 25235.900390625, signal: 'SELL' },
  { date: '2024-09-02', close: 25278.69921875, signal: 'SELL' },
  { date: '2024-09-03', close: 25279.849609375, signal: 'SELL' },
  { date: '2024-09-04', close: 25198.69921875, signal: 'SELL' },
  { date: '2024-09-05', close: 25145.099609375, signal: 'SELL' },
  { date: '2024-09-24', close: 25940.400390625, signal: 'SELL' },
  { date: '2024-09-25', close: 26004.150390625, signal: 'SELL' },
  { date: '2024-09-26', close: 26216.05078125, signal: 'SELL' },
  { date: '2024-09-27', close: 26178.94921875, signal: 'SELL' },
  { date: '2024-10-01', close: 25796.900390625, signal: 'SELL' },
  { date: '2024-12-05', close: 24708.400390625, signal: 'SELL' },
  { date: '2024-12-06', close: 24677.80078125, signal: 'SELL' },
  { date: '2024-12-09', close: 24619.0, signal: 'SELL' },
  { date: '2024-12-10', close: 24610.05078125, signal: 'SELL' },
  { date: '2024-12-11', close: 24641.80078125, signal: 'SELL' },
];

const Backtesting = () => {
  const [symbol, setSymbol] = useState('^NSEI');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  });
  const [isRunning, setIsRunning] = useState(false);
  const [chartData, setChartData] = useState(hardcodedData);
  const [results, setResults] = useState({
    totalReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0
  });

  const calculateMetrics = (data) => {
    const returns = data.map((candle, idx) => {
      if (idx === 0) return 0;
      return (candle.close - data[idx - 1].close) / data[idx - 1].close;
    });

    const strategyReturns = returns.map((ret, idx) => {
      if (data[idx].signal === 'BUY') return ret;
      if (data[idx].signal === 'SELL') return -ret;
      return 0;
    });

    const cumulativeReturns = strategyReturns.reduce((acc, ret) => {
      const last = acc[acc.length - 1] || 1;
      acc.push(last * (1 + ret));
      return acc;
    }, []);

    const totalReturn = ((cumulativeReturns[cumulativeReturns.length - 1] - 1) * 100);

    const riskFreeRate = 0.02 / 252;
    const excessReturns = strategyReturns.map(r => r - riskFreeRate);
    const meanExcessReturn = _.mean(excessReturns);
    const stdDev = Math.sqrt(_.mean(excessReturns.map(r => Math.pow(r - meanExcessReturn, 2))));
    const sharpeRatio = meanExcessReturn / stdDev * Math.sqrt(252);

    let maxDrawdown = 0;
    let peak = -Infinity;
    cumulativeReturns.forEach(ret => {
      peak = Math.max(peak, ret);
      const drawdown = (peak - ret) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    const trades = data.filter(d => d.signal !== 'NONE').length;
    const wins = strategyReturns.filter(r => r > 0).length;
    const winRate = trades > 0 ? (wins / trades) * 100 : 0;

    return {
      totalReturn: totalReturn.toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2),
      maxDrawdown: (maxDrawdown * 100).toFixed(2),
      winRate: winRate.toFixed(1)
    };
  };

  const handleRunBacktest = () => {
    const metrics = calculateMetrics(chartData);
    setResults(metrics);
  };

  const handleReset = () => {
    setChartData(hardcodedData);
    setResults({
      totalReturn: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      winRate: 0
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Backtest Configuration</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Stock Symbol</label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Enter stock symbol (e.g. ^NSEI, AAPL)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Select Strategy</label>
                <select
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                >
                  <option value="">Select a strategy</option>
                  <option value="SMA">SMA Crossover</option>
                  <option value="RSI">RSI Strategy</option>
                  <option value="MACD">MACD Strategy</option>
                  <option value="BB">Bollinger Bands</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Start Date</label>
                <input
                  type="date"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">End Date</label>
                <input
                  type="date"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
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
                  onClick={handleReset}
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

          <div className="w-full h-96 bg-black/50 p-4 rounded-lg border border-gray-800">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date"
                    tick={{ fill: '#9ca3af' }}
                    tickLine={{ stroke: '#4b5563' }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tick={{ fill: '#9ca3af' }}
                    tickLine={{ stroke: '#4b5563' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      borderColor: '#374151',
                      borderRadius: '0.5rem',
                      padding: '0.75rem'
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: '1rem',
                      color: '#9ca3af'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#8884d8"
                    dot={false}
                    name="Price"
                  />
                  <Scatter
                    dataKey={data => data.signal === 'BUY' ? data.close : null}
                    fill="#4ade80"
                    name="Buy Signal"
                  />
                  <Scatter
                    dataKey={data => data.signal === 'SELL' ? data.close : null}
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
};

export default Backtesting;