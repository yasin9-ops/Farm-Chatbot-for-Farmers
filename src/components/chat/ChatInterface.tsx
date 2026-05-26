import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { getCropRecommendation } from "@/integrations/ml";
import { updateSoilType, getUserProfile } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingSoil, setAwaitingSoil] = useState(false);
  const [userSoilType, setUserSoilType] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial greeting
    setMessages([
      {
        id: '1',
        text: t('botGreeting'),
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Crop recommendations
    if (lowerMessage.includes('crop') || lowerMessage.includes('grow') || lowerMessage.includes('plant')) {
      if (language === 'te') {
        return "మీ ప్రాంతం మరియు సీజన్ ఆధారంగా, నేను వరి, మొక్కజొన్న, పత్తి లేదా చెరకు సిఫార్సు చేస్తున్నాను. మీ నేల రకం మరియు నీటిపారుదల సౌకర్యాల గురించి మరిన్ని వివరాలు చెప్పగలరా?";
      }
      return "Based on your region and season, I recommend considering rice, maize, cotton, or sugarcane. Could you tell me more about your soil type and irrigation facilities?";
    }

    // Weather related
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
      if (language === 'te') {
        return "వాతావరణ సమాచారం కోసం, మీ స్థానాన్ని తెలియజేయండి. సాధారణంగా, ఖరీఫ్ సీజన్‌లో వర్షాధార పంటలు, రబీ సీజన్‌లో నీటిపారుదల పంటలు సిఫార్సు చేయబడతాయి.";
      }
      return "For weather information, please share your location. Generally, rainfed crops are recommended during Kharif season, and irrigated crops during Rabi season.";
    }

    // Disease related
    if (lowerMessage.includes('disease') || lowerMessage.includes('pest') || lowerMessage.includes('infection')) {
      if (language === 'te') {
        return "పంట వ్యాధిని గుర్తించడానికి, దయచేసి ప్రభావిత ఆకులు లేదా మొక్కల ఫోటో అప్‌లోడ్ చేయండి. నేను వ్యాధిని విశ్లేషించి, తగిన చికిత్సను సూచిస్తాను.";
      }
      return "To identify crop disease, please upload a photo of the affected leaves or plants. I'll analyze the disease and suggest appropriate treatment.";
    }

    // Price related
    if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('sell')) {
      if (language === 'te') {
        return "మార్కెట్ ధరలు రోజూ మారుతాయి. ప్రస్తుత ధరలు: వరి ₹2,000-2,200/క్వింటాల్, మొక్కజొన్న ₹1,800-2,000/క్వింటాల్, పత్తి ₹6,000-6,500/క్వింటాల్. మీకు నిర్దిష్ట పంట ధరలు కావాలా?";
      }
      return "Market prices change daily. Current prices: Rice ₹2,000-2,200/quintal, Maize ₹1,800-2,000/quintal, Cotton ₹6,000-6,500/quintal. Would you like prices for a specific crop?";
    }

    // Fertilizer related
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient') || lowerMessage.includes('manure')) {
      if (language === 'te') {
        return "సమతుల్య ఎరువు వినియోగం ముఖ్యం. వరికి: యూరియా 100kg, DAP 50kg, MOP 50kg ఎకరానికి సిఫార్సు. నేల పరీక్ష ఆధారంగా ఖచ్చితమైన మోతాదు నిర్ణయించవచ్చు.";
      }
      return "Balanced fertilizer use is important. For rice: Urea 100kg, DAP 50kg, MOP 50kg per acre is recommended. Exact dosage can be determined based on soil testing.";
    }

    // Scheme related
    if (lowerMessage.includes('scheme') || lowerMessage.includes('subsidy') || lowerMessage.includes('government')) {
      if (language === 'te') {
        return "అనేక ప్రభుత్వ పథకాలు అందుబాటులో ఉన్నాయి: PM-KISAN (₹6,000/సంవత్సరం), పంట బీమా, రాయితీ విత్తనాలు, డ్రిప్ ఇరిగేషన్ సబ్సిడీ. మీకు ఏ పథకం గురించి వివరాలు కావాలి?";
      }
      return "Several government schemes are available: PM-KISAN (₹6,000/year), Crop Insurance, Subsidized Seeds, Drip Irrigation Subsidy. Which scheme would you like details about?";
    }

    // Default response
    if (language === 'te') {
      return "నేను మీకు పంట సిఫార్సులు, వ్యాధి గుర్తింపు, మార్కెట్ ధరలు, వాతావరణ సమాచారం మరియు ప్రభుత్వ పథకాల గురించి సహాయం చేయగలను. దయచేసి మీ ప్రశ్నను మరింత వివరంగా అడగండి.";
    }
    return "I can help you with crop recommendations, disease identification, market prices, weather information, and government schemes. Please ask your question in more detail.";
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    try {
      let botText = generateBotResponse(text);

      // ✅ If waiting for soil type
      if (awaitingSoil) {
        const soil = text.trim();

        setUserSoilType(soil);  // await updateSoilType(currentUser.id, soil);
        setAwaitingSoil(false);

        const result = await getCropRecommendation(soil, {
          temperature: 28,
          humidity: 70,
          rainfall: 200,
        });

        const botResponse: Message = {
          id: Date.now().toString(),
          text: `🌾 Recommended Crop: ${result.recommended_crop}`,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
        return;
      }
      const lowerMessage = text.toLowerCase();

      if (
        lowerMessage.includes("crop") ||
        lowerMessage.includes("grow") ||
        lowerMessage.includes("plant")
      ) {
        if (!userSoilType) {
          setAwaitingSoil(true);

          const botResponse: Message = {
            id: Date.now().toString(),
            text: "Please tell me your soil type (Black, Red, Sandy, Alluvial).",
            isBot: true,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botResponse]);
          setIsLoading(false);
          return;
        }

        const result = await getCropRecommendation(userSoilType, {
          temperature: 28,
          humidity: 70,
          rainfall: 200,
        });

        botText = `🌾 Recommended Crop: ${result.recommended_crop}`;
      }
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Unable to fetch crop recommendation.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleImageUpload = (file: File) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `[Uploaded image: ${file.name}] Please analyze this crop image for any diseases.`,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const response = language === 'te'
        ? "మీ చిత్రాన్ని విశ్లేషిస్తున్నాను... ఇది ఆకు మచ్చ వ్యాధి లాగా కనిపిస్తోంది. మాంకోజెబ్ 2.5 గ్రాముల/లీటర్ నీటిలో కలిపి పిచికారీ చేయండి. 15 రోజుల తర్వాత మళ్ళీ పిచికారీ చేయండి."
        : "Analyzing your image... This appears to be leaf spot disease. Spray Mancozeb 2.5g/liter of water. Repeat application after 15 days.";

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isBot={message.isBot}
            timestamp={message.timestamp}
          />
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
            <div className="chat-bubble-bot px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-background to-transparent">
        <ChatInput
          onSendMessage={handleSendMessage}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
