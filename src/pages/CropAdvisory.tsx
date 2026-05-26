import React, { useState } from 'react';
import { Leaf, Droplets, Thermometer, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const soilTypes = [
  { id: 'alluvial', name: 'Alluvial Soil', nameTE: 'ఒండ్రు నేల' },
  { id: 'black', name: 'Black Soil', nameTE: 'నల్ల నేల' },
  { id: 'red', name: 'Red Soil', nameTE: 'ఎర్ర నేల' },
  { id: 'laterite', name: 'Laterite Soil', nameTE: 'లేటరైట్ నేల' },
  { id: 'sandy', name: 'Sandy Soil', nameTE: 'ఇసుక నేల' },
];

const seasons = [
  { id: 'kharif', name: 'Kharif (Jun-Oct)', nameTE: 'ఖరీఫ్ (జూన్-అక్టో)' },
  { id: 'rabi', name: 'Rabi (Oct-Mar)', nameTE: 'రబీ (అక్టో-మార్చి)' },
  { id: 'zaid', name: 'Zaid (Mar-Jun)', nameTE: 'జైద్ (మార్చి-జూన్)' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cropRecommendations: Record<string, any[]> = {
  'alluvial-kharif': [
    { name: 'Rice', nameTE: 'వరి', yield: '50-60 q/ha', water: 'High' },
    { name: 'Maize', nameTE: 'మొక్కజొన్న', yield: '40-50 q/ha', water: 'Medium' },
    { name: 'Sugarcane', nameTE: 'చెరకు', yield: '800-1000 q/ha', water: 'High' },
  ],
  'alluvial-rabi': [
    { name: 'Wheat', nameTE: 'గోధుమ', yield: '40-50 q/ha', water: 'Medium' },
    { name: 'Mustard', nameTE: 'ఆవాలు', yield: '15-20 q/ha', water: 'Low' },
    { name: 'Potato', nameTE: 'బంగాళాదుంప', yield: '200-300 q/ha', water: 'Medium' },
  ],
  'black-kharif': [
    { name: 'Cotton', nameTE: 'పత్తి', yield: '15-20 q/ha', water: 'Medium' },
    { name: 'Soybean', nameTE: 'సోయాబీన్', yield: '20-25 q/ha', water: 'Medium' },
    { name: 'Sorghum', nameTE: 'జొన్న', yield: '25-30 q/ha', water: 'Low' },
  ],
  'black-rabi': [
    { name: 'Chickpea', nameTE: 'శనగలు', yield: '15-20 q/ha', water: 'Low' },
    { name: 'Wheat', nameTE: 'గోధుమ', yield: '35-45 q/ha', water: 'Medium' },
    { name: 'Safflower', nameTE: 'కుసుమ', yield: '10-15 q/ha', water: 'Low' },
  ],
  'red-kharif': [
    { name: 'Groundnut', nameTE: 'వేరుశనగ', yield: '20-25 q/ha', water: 'Medium' },
    { name: 'Finger Millet', nameTE: 'రాగి', yield: '20-25 q/ha', water: 'Low' },
    { name: 'Pigeon Pea', nameTE: 'కంది', yield: '15-20 q/ha', water: 'Low' },
  ],
  'red-rabi': [
    { name: 'Sunflower', nameTE: 'పొద్దుతిరుగుడు', yield: '15-20 q/ha', water: 'Medium' },
    { name: 'Coriander', nameTE: 'కొత్తిమీర', yield: '8-10 q/ha', water: 'Low' },
    { name: 'Tomato', nameTE: 'టమాటా', yield: '400-500 q/ha', water: 'Medium' },
  ],
};

const CropAdvisory: React.FC = () => {
  const { language } = useLanguage();
  const [selectedSoil, setSelectedSoil] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = () => {
    if (!selectedSoil || !selectedSeason) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const key = `${selectedSoil}-${selectedSeason}`;
      setRecommendations(cropRecommendations[key] || cropRecommendations['alluvial-kharif']);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-leaf/10 rounded-full mb-4">
              <Leaf className="h-4 w-4 text-leaf" />
              <span className="text-sm font-medium text-leaf">
                {language === 'te' ? 'పంట సలహా' : 'Crop Advisory'}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'te' ? 'మీ పంటను ఎంచుకోండి' : 'Get Crop Recommendations'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'te' 
                ? 'మీ నేల రకం మరియు సీజన్ ఆధారంగా అత్యుత్తమ పంట సిఫార్సులు పొందండి'
                : 'Get the best crop recommendations based on your soil type and season'}
            </p>
          </div>

          {/* Form Section */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Soil Type Selection */}
              <div className="feature-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-earth/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-earth" />
                  </div>
                  <h3 className="font-heading font-semibold">
                    {language === 'te' ? 'నేల రకం' : 'Soil Type'}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {soilTypes.map((soil) => (
                    <button
                      key={soil.id}
                      onClick={() => setSelectedSoil(soil.id)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedSoil === soil.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {language === 'te' ? soil.nameTE : soil.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season Selection */}
              <div className="feature-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky/10 flex items-center justify-center">
                    <Thermometer className="h-5 w-5 text-sky" />
                  </div>
                  <h3 className="font-heading font-semibold">
                    {language === 'te' ? 'సీజన్' : 'Season'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {seasons.map((season) => (
                    <button
                      key={season.id}
                      onClick={() => setSelectedSeason(season.id)}
                      className={`w-full p-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                        selectedSeason === season.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {language === 'te' ? season.nameTE : season.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Get Recommendations Button */}
            <div className="text-center mb-8">
              <Button
                variant="hero"
                size="lg"
                onClick={handleGetRecommendations}
                disabled={!selectedSoil || !selectedSeason || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Leaf className="h-5 w-5" />
                )}
                {language === 'te' ? 'సిఫార్సులు పొందండి' : 'Get Recommendations'}
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Results */}
            {recommendations.length > 0 && (
              <div className="animate-fade-in">
                <h3 className="font-heading text-xl font-semibold mb-6 text-center">
                  {language === 'te' ? 'సిఫార్సు చేసిన పంటలు' : 'Recommended Crops'}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendations.map((crop, index) => (
                    <div
                      key={index}
                      className="feature-card animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center">
                          <Leaf className="h-6 w-6 text-leaf" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {language === 'te' ? crop.nameTE : crop.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {language === 'te' ? 'సిఫార్సు చేయబడింది' : 'Recommended'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {language === 'te' ? 'దిగుబడి' : 'Expected Yield'}
                          </span>
                          <span className="font-medium text-foreground">{crop.yield}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {language === 'te' ? 'నీటి అవసరం' : 'Water Need'}
                          </span>
                          <span className={`font-medium ${
                            crop.water === 'High' ? 'text-sky' :
                            crop.water === 'Medium' ? 'text-wheat' : 'text-leaf'
                          }`}>
                            {crop.water}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CropAdvisory;
