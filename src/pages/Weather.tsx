import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Thermometer, Loader2, MapPin, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    feels_like: number;
    humidity: number;
    precipitation: number;
    wind_speed: number;
    description: string;
    descriptionTE: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation: number;
    precipitation_probability: number;
    description: string;
    descriptionTE: string;
    icon: string;
  }>;
  farming_advice: {
    en: string;
    te: string;
  };
}

const Weather: React.FC = () => {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);

  const fetchWeather = async (lat: number, lon: number, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { latitude: lat, longitude: lon, location_name: name },
      });

      if (error) throw error;
      setWeather(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Weather fetch error:', error);
      toast({
        title: language === 'te' ? 'లోపం' : 'Error',
        description: language === 'te' ? 'వాతావరణ డేటా పొందడం విఫలమైంది' : 'Failed to fetch weather data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude, name: 'Your Location' });
          fetchWeather(latitude, longitude, 'Your Location');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
          // Use default location (Hyderabad)
          const defaultLocation = { lat: 17.385, lon: 78.4867, name: 'Hyderabad' };
          setLocation(defaultLocation);
          fetchWeather(defaultLocation.lat, defaultLocation.lon, defaultLocation.name);
        }
      );
    } else {
      // Use default location
      const defaultLocation = { lat: 17.385, lon: 78.4867, name: 'Hyderabad' };
      setLocation(defaultLocation);
      fetchWeather(defaultLocation.lat, defaultLocation.lon, defaultLocation.name);
    }
  };

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN', options);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky/10 rounded-full mb-4">
              <Cloud className="h-4 w-4 text-sky" />
              <span className="text-sm font-medium text-sky">
                {language === 'te' ? 'వాతావరణం' : 'Weather'}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'te' ? 'వాతావరణ సూచన' : 'Weather Forecast'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'te'
                ? 'మీ ప్రాంతం కోసం వాతావరణ అంచనాలు మరియు వ్యవసాయ సలహాలు'
                : 'Weather predictions and farming advice for your region'}
            </p>
          </div>

          {isLoading && !weather ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : weather ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Current Weather */}
              <div className="feature-card">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="text-6xl">{weather.current.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4" />
                        <span>{weather.location}</span>
                      </div>
                      <div className="font-heading text-5xl font-bold text-foreground">
                        {Math.round(weather.current.temperature)}°C
                      </div>
                      <p className="text-lg text-muted-foreground">
                        {language === 'te' ? weather.current.descriptionTE : weather.current.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <Thermometer className="h-6 w-6 text-terracotta mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">
                        {language === 'te' ? 'అనుభూతి' : 'Feels like'}
                      </p>
                      <p className="font-semibold">{Math.round(weather.current.feels_like)}°C</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="h-6 w-6 text-sky mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">
                        {language === 'te' ? 'తేమ' : 'Humidity'}
                      </p>
                      <p className="font-semibold">{weather.current.humidity}%</p>
                    </div>
                    <div className="text-center">
                      <Wind className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">
                        {language === 'te' ? 'గాలి' : 'Wind'}
                      </p>
                      <p className="font-semibold">{Math.round(weather.current.wind_speed)} km/h</p>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" onClick={getLocation} disabled={isLoading}>
                    <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Farming Advice */}
              <div className="feature-card bg-gradient-to-r from-leaf/5 to-primary/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-leaf/10 flex items-center justify-center flex-shrink-0">
                    <Cloud className="h-6 w-6 text-leaf" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">
                      {language === 'te' ? 'వ్యవసాయ సలహా' : 'Farming Advice'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'te' ? weather.farming_advice.te : weather.farming_advice.en}
                    </p>
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast */}
              <div>
                <h3 className="font-heading text-xl font-semibold mb-4">
                  {language === 'te' ? '7 రోజుల సూచన' : '7-Day Forecast'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {weather.forecast.map((day, index) => (
                    <div
                      key={day.date}
                      className={`feature-card text-center animate-fade-in ${index === 0 ? 'ring-2 ring-primary/50' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        {index === 0 ? (language === 'te' ? 'ఈ రోజు' : 'Today') : formatDate(day.date)}
                      </p>
                      <div className="text-3xl mb-2">{day.icon}</div>
                      <div className="flex justify-center gap-2 text-sm">
                        <span className="font-semibold">{Math.round(day.temp_max)}°</span>
                        <span className="text-muted-foreground">{Math.round(day.temp_min)}°</span>
                      </div>
                      {day.precipitation_probability > 20 && (
                        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-sky">
                          <Droplets className="h-3 w-3" />
                          {day.precipitation_probability}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'te' ? 'వాతావరణ డేటా అందుబాటులో లేదు' : 'Weather data not available'}
              </p>
              <Button variant="outline" className="mt-4" onClick={getLocation}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === 'te' ? 'మళ్ళీ ప్రయత్నించండి' : 'Try Again'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Weather;
