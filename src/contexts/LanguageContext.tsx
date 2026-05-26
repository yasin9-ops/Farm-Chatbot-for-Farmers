import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'te';

interface Translations {
  [key: string]: {
    en: string;
    te: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: 'Home', te: 'హోమ్' },
  cropAdvisory: { en: 'Crop Advisory', te: 'పంట సలహా' },
  marketPrices: { en: 'Market Prices', te: 'మార్కెట్ ధరలు' },
  schemes: { en: 'Schemes', te: 'పథకాలు' },
  about: { en: 'About', te: 'గురించి' },
  
  // Chat
  askQuestion: { en: 'Ask your farming question...', te: 'మీ వ్యవసాయ ప్రశ్నను అడగండి...' },
  send: { en: 'Send', te: 'పంపు' },
  voiceInput: { en: 'Voice Input', te: 'వాయిస్ ఇన్‌పుట్' },
  listening: { en: 'Listening...', te: 'వింటున్నాను...' },
  
  // Hero
  heroTitle: { en: 'Your Digital Farming Assistant', te: 'మీ డిజిటల్ వ్యవసాయ సహాయకుడు' },
  heroSubtitle: { en: 'Get AI-powered advice for better farming. Ask about crops, weather, prices, and more.', te: 'మెరుగైన వ్యవసాయం కోసం AI-ఆధారిత సలహా పొందండి. పంటలు, వాతావరణం, ధరలు మరియు మరిన్ని గురించి అడగండి.' },
  startChat: { en: 'Start Chatting', te: 'చాట్ ప్రారంభించండి' },
  
  // Features
  cropRecommendation: { en: 'Crop Recommendation', te: 'పంట సిఫార్సు' },
  cropRecommendationDesc: { en: 'Get personalized crop suggestions based on your soil, climate, and season', te: 'మీ నేల, వాతావరణం మరియు సీజన్ ఆధారంగా వ్యక్తిగతీకరించిన పంట సూచనలు పొందండి' },
  diseaseDetection: { en: 'Disease Detection', te: 'వ్యాధి గుర్తింపు' },
  diseaseDetectionDesc: { en: 'Upload crop images to identify diseases and get treatment advice', te: 'వ్యాధులను గుర్తించడానికి మరియు చికిత్స సలహా పొందడానికి పంట చిత్రాలను అప్‌లోడ్ చేయండి' },
  marketInfo: { en: 'Market Information', te: 'మార్కెట్ సమాచారం' },
  marketInfoDesc: { en: 'Real-time crop prices and market trends in your area', te: 'మీ ప్రాంతంలో నిజ-సమయ పంట ధరలు మరియు మార్కెట్ పోకడలు' },
  weatherForecast: { en: 'Weather Forecast', te: 'వాతావరణ సూచన' },
  weatherForecastDesc: { en: 'Get accurate weather predictions for better farm planning', te: 'మెరుగైన వ్యవసాయ ప్రణాళిక కోసం ఖచ్చితమైన వాతావరణ అంచనాలు పొందండి' },
  
  // Schemes
  govSchemes: { en: 'Government Schemes', te: 'ప్రభుత్వ పథకాలు' },
  schemesDesc: { en: 'Discover agricultural schemes and subsidies available for you', te: 'మీ కోసం అందుబాటులో ఉన్న వ్యవసాయ పథకాలు మరియు సబ్సిడీలను కనుగొనండి' },
  
  // Common
  welcome: { en: 'Welcome, Farmer!', te: 'స్వాగతం, రైతు!' },
  loading: { en: 'Loading...', te: 'లోడ్ అవుతోంది...' },
  error: { en: 'Something went wrong', te: 'ఏదో తప్పు జరిగింది' },
  tryAgain: { en: 'Try Again', te: 'మళ్ళీ ప్రయత్నించండి' },
  
  // Bot messages
  botGreeting: { en: "Hello! I'm your farming assistant. How can I help you today? You can ask me about crops, weather, market prices, or any farming questions.", te: "హలో! నేను మీ వ్యవసాయ సహాయకుడిని. ఈ రోజు మీకు ఎలా సహాయం చేయగలను? మీరు నన్ను పంటలు, వాతావరణం, మార్కెట్ ధరలు లేదా ఏదైనా వ్యవసాయ ప్రశ్నల గురించి అడగవచ్చు." },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
