'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sentiment analysis helper functions
const analyzeSentiment = (score) => {
  if (score > 0.05) return 'positive';
  if (score < -0.05) return 'negative';
  return 'neutral';
};

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return 'bg-emerald-400/10 text-emerald-400';
    case 'negative':
      return 'bg-red-400/10 text-red-400';
    default:
      return 'bg-gray-400/10 text-gray-400';
  }
};

const COLORS = ['#4CAF50', '#f44336', '#FFC107']; // Green, Red, Yellow for positive, negative, neutral

const NewsComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentimentData, setSentimentData] = useState({ timeline: [], distribution: [] });

  const API_KEY = '63fd6e600c0a4246bcfefbab8a81d061';

  const processArticlesForCharts = (articles) => {
    // Process for timeline chart
    const timeline = articles.map(article => ({
      date: new Date(article.publishedAt).toLocaleDateString(),
      sentimentScore: article.sentimentScore,
      title: article.title
    }));

    // Process for distribution pie chart
    const sentiments = articles.map(article => analyzeSentiment(article.sentimentScore));
    const distribution = [
      { name: 'Positive', value: sentiments.filter(s => s === 'positive').length },
      { name: 'Negative', value: sentiments.filter(s => s === 'negative').length },
      { name: 'Neutral', value: sentiments.filter(s => s === 'neutral').length }
    ];

    return { timeline, distribution };
  };

  const fetchNews = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${query || 'stock market'}&apiKey=${API_KEY}&language=en&sortBy=publishedAt&pageSize=20`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        const processedArticles = data.articles.map(article => ({
          ...article,
          sentimentScore: Math.random() * 2 - 1, // Dummy score between -1 and 1
          category: determineCategoryFromContent(article.title + ' ' + article.description)
        }));
        setNews(processedArticles);
        setSentimentData(processArticlesForCharts(processedArticles));
      } else {
        setError(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const determineCategoryFromContent = (content) => {
    const categories = {
      'Economy': ['gdp', 'inflation', 'federal reserve', 'interest rates'],
      'Markets': ['stocks', 'shares', 'trading', 'market'],
      'Technology': ['tech', 'ai', 'digital', 'software'],
      'Global': ['global', 'international', 'world', 'foreign']
    };

    content = content.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        return category;
      }
    }
    return 'General';
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(searchQuery);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} day ago`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <p className="text-gray-200">{`Date: ${payload[0].payload.date}`}</p>
          <p className="text-gray-200">{`Sentiment: ${payload[0].value.toFixed(2)}`}</p>
          <p className="text-gray-200">{`Title: ${payload[0].payload.title}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 bg-black text-gray-200" id="news">
      <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Market News</h2>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-gray-700 text-gray-200"
            />
          </div>
        </form>

        {/* Sentiment Analysis Charts */}
        {!loading && !error && news.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">Sentiment Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline Chart */}
              <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                <h4 className="text-lg font-medium mb-4 text-gray-200">Sentiment Over Time</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sentimentData.timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="sentimentScore" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution Pie Chart */}
              <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                <h4 className="text-lg font-medium mb-4 text-gray-200">Sentiment Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData.distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sentimentData.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200 mx-auto"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-center mb-6">
            {error}
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 gap-6">
          {news.map((item, index) => {
            const sentiment = analyzeSentiment(item.sentimentScore);
            return (
              <div
                key={index}
                className="bg-black/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
                      <span className={`text-sm px-2 py-1 rounded-full ${getSentimentColor(sentiment)}`}>
                        {item.category}
                      </span>
                      <span className="text-sm text-gray-400">{formatTime(item.publishedAt)}</span>
                      <span className="text-sm text-gray-400">{item.source.name}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-100">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors ml-4"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            No news articles found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsComponent;