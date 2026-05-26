import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Minus, Search, MapPin, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface CropPrice {
  id: string;
  name: string;
  nameTE: string;
  price: number;
  unit: string;
  change: number;
  market: string;
  category: string;
}

const mockPrices: CropPrice[] = [
  { id: '1', name: 'Rice (Paddy)', nameTE: 'వరి', price: 2150, unit: 'quintal', change: 2.5, market: 'Guntur', category: 'cereals' },
  { id: '2', name: 'Wheat', nameTE: 'గోధుమ', price: 2425, unit: 'quintal', change: -1.2, market: 'Hyderabad', category: 'cereals' },
  { id: '3', name: 'Maize', nameTE: 'మొక్కజొన్న', price: 1950, unit: 'quintal', change: 0, market: 'Warangal', category: 'cereals' },
  { id: '4', name: 'Cotton', nameTE: 'పత్తి', price: 6200, unit: 'quintal', change: 3.8, market: 'Adilabad', category: 'cash' },
  { id: '5', name: 'Groundnut', nameTE: 'వేరుశనగ', price: 5500, unit: 'quintal', change: 1.5, market: 'Anantapur', category: 'oilseeds' },
  { id: '6', name: 'Chilli (Dry)', nameTE: 'మిర్చి', price: 12500, unit: 'quintal', change: -2.1, market: 'Guntur', category: 'spices' },
  { id: '7', name: 'Turmeric', nameTE: 'పసుపు', price: 8200, unit: 'quintal', change: 4.2, market: 'Nizamabad', category: 'spices' },
  { id: '8', name: 'Tomato', nameTE: 'టమాటా', price: 2800, unit: 'quintal', change: -5.3, market: 'Madanapalle', category: 'vegetables' },
  { id: '9', name: 'Onion', nameTE: 'ఉల్లి', price: 1800, unit: 'quintal', change: 8.2, market: 'Kurnool', category: 'vegetables' },
  { id: '10', name: 'Sugarcane', nameTE: 'చెరకు', price: 310, unit: 'quintal', change: 0.5, market: 'Visakhapatnam', category: 'cash' },
];

const categories = [
  { id: 'all', name: 'All Crops', nameTE: 'అన్ని పంటలు' },
  { id: 'cereals', name: 'Cereals', nameTE: 'ధాన్యాలు' },
  { id: 'vegetables', name: 'Vegetables', nameTE: 'కూరగాయలు' },
  { id: 'oilseeds', name: 'Oilseeds', nameTE: 'నూనెగింజలు' },
  { id: 'spices', name: 'Spices', nameTE: 'మసాలాలు' },
  { id: 'cash', name: 'Cash Crops', nameTE: 'వాణిజ్య పంటలు' },
];

const MarketPrices: React.FC = () => {
  const { language } = useLanguage();
  const [prices, setPrices] = useState<CropPrice[]>(mockPrices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredPrices = prices.filter((price) => {
    const matchesSearch = 
      price.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.nameTE.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || price.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate price updates
      setPrices(prices.map(p => ({
        ...p,
        change: (Math.random() - 0.5) * 10,
        price: p.price + Math.round((Math.random() - 0.5) * 100)
      })));
      setIsRefreshing(false);
    }, 1500);
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-leaf" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-leaf';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-wheat/10 rounded-full mb-4">
              <IndianRupee className="h-4 w-4 text-wheat" />
              <span className="text-sm font-medium text-wheat">
                {language === 'te' ? 'మార్కెట్ ధరలు' : 'Market Prices'}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'te' ? 'రోజువారీ మార్కెట్ ధరలు' : 'Daily Market Prices'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'te' 
                ? 'తెలంగాణ మరియు ఆంధ్రప్రదేశ్‌లోని ప్రధాన మార్కెట్ల నుండి నిజ-సమయ ధరలు'
                : 'Real-time prices from major markets in Telangana and Andhra Pradesh'}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={language === 'te' ? 'పంట శోధించండి...' : 'Search crop...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {language === 'te' ? 'రిఫ్రెష్' : 'Refresh'}
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {language === 'te' ? cat.nameTE : cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Cards */}
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {filteredPrices.map((crop, index) => (
                <div
                  key={crop.id}
                  className="feature-card flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-wheat/10 flex items-center justify-center">
                      <IndianRupee className="h-6 w-6 text-wheat" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {language === 'te' ? crop.nameTE : crop.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {crop.market}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <div className="font-heading text-2xl font-bold text-foreground">
                        ₹{crop.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        per {crop.unit}
                      </div>
                    </div>

                    <div className={`flex items-center gap-1 ${getTrendColor(crop.change)}`}>
                      {getTrendIcon(crop.change)}
                      <span className="font-medium">
                        {crop.change > 0 ? '+' : ''}{crop.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPrices.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {language === 'te' 
                  ? 'ఏ ఫలితాలు కనుగొనబడలేదు'
                  : 'No results found'}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketPrices;
