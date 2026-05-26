const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Open-Meteo is a free weather API that doesn't require an API key
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, location_name } = await req.json();

    if (!latitude || !longitude) {
      return new Response(JSON.stringify({ error: 'Latitude and longitude are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching weather for: ${location_name || 'Unknown'} (${latitude}, ${longitude})`);

    // Fetch current weather and forecast
    const weatherUrl = `${OPEN_METEO_BASE}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=7`;

    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data fetched successfully');

    // Weather code descriptions
    const weatherDescriptions: Record<number, { description: string; descriptionTE: string; icon: string }> = {
      0: { description: 'Clear sky', descriptionTE: 'స్పష్టమైన ఆకాశం', icon: '☀️' },
      1: { description: 'Mainly clear', descriptionTE: 'ప్రధానంగా స్పష్టం', icon: '🌤️' },
      2: { description: 'Partly cloudy', descriptionTE: 'పాక్షికంగా మేఘావృతం', icon: '⛅' },
      3: { description: 'Overcast', descriptionTE: 'మేఘావృతం', icon: '☁️' },
      45: { description: 'Fog', descriptionTE: 'పొగమంచు', icon: '🌫️' },
      48: { description: 'Depositing rime fog', descriptionTE: 'మంచు పొగ', icon: '🌫️' },
      51: { description: 'Light drizzle', descriptionTE: 'తేలికపాటి చినుకులు', icon: '🌧️' },
      53: { description: 'Moderate drizzle', descriptionTE: 'మధ్యస్థ చినుకులు', icon: '🌧️' },
      55: { description: 'Dense drizzle', descriptionTE: 'భారీ చినుకులు', icon: '🌧️' },
      61: { description: 'Slight rain', descriptionTE: 'తేలికపాటి వర్షం', icon: '🌧️' },
      63: { description: 'Moderate rain', descriptionTE: 'మధ్యస్థ వర్షం', icon: '🌧️' },
      65: { description: 'Heavy rain', descriptionTE: 'భారీ వర్షం', icon: '🌧️' },
      80: { description: 'Slight rain showers', descriptionTE: 'తేలికపాటి వర్షం జల్లులు', icon: '🌦️' },
      81: { description: 'Moderate rain showers', descriptionTE: 'మధ్యస్థ వర్షం జల్లులు', icon: '🌦️' },
      82: { description: 'Violent rain showers', descriptionTE: 'తీవ్ర వర్షం జల్లులు', icon: '⛈️' },
      95: { description: 'Thunderstorm', descriptionTE: 'ఉరుములతో కూడిన వర్షం', icon: '⛈️' },
      96: { description: 'Thunderstorm with hail', descriptionTE: 'వడగళ్ళతో ఉరుములు', icon: '⛈️' },
      99: { description: 'Thunderstorm with heavy hail', descriptionTE: 'భారీ వడగళ్ళతో ఉరుములు', icon: '⛈️' },
    };

    const currentCode = weatherData.current.weather_code;
    const currentWeatherInfo = weatherDescriptions[currentCode] || { 
      description: 'Unknown', 
      descriptionTE: 'తెలియదు', 
      icon: '🌡️' 
    };

    // Format the response
    const formattedWeather = {
      location: location_name || `${latitude}, ${longitude}`,
      current: {
        temperature: weatherData.current.temperature_2m,
        feels_like: weatherData.current.apparent_temperature,
        humidity: weatherData.current.relative_humidity_2m,
        precipitation: weatherData.current.precipitation,
        rain: weatherData.current.rain,
        wind_speed: weatherData.current.wind_speed_10m,
        weather_code: currentCode,
        description: currentWeatherInfo.description,
        descriptionTE: currentWeatherInfo.descriptionTE,
        icon: currentWeatherInfo.icon,
      },
      forecast: weatherData.daily.time.map((date: string, index: number) => {
        const code = weatherData.daily.weather_code[index];
        const info = weatherDescriptions[code] || { description: 'Unknown', descriptionTE: 'తెలియదు', icon: '🌡️' };
        return {
          date,
          temp_max: weatherData.daily.temperature_2m_max[index],
          temp_min: weatherData.daily.temperature_2m_min[index],
          precipitation: weatherData.daily.precipitation_sum[index],
          precipitation_probability: weatherData.daily.precipitation_probability_max[index],
          weather_code: code,
          description: info.description,
          descriptionTE: info.descriptionTE,
          icon: info.icon,
        };
      }),
      farming_advice: generateFarmingAdvice(weatherData),
    };

    return new Response(JSON.stringify(formattedWeather), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Weather fetch error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch weather';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// deno-lint-ignore no-explicit-any
function generateFarmingAdvice(weatherData: any): { en: string; te: string } {
  const currentTemp = weatherData.current.temperature_2m;
  const currentRain = weatherData.current.rain;
  const upcomingRain = weatherData.daily.precipitation_sum.slice(0, 3).reduce((a: number, b: number) => a + b, 0);

  let adviceEN = '';
  let adviceTE = '';

  if (upcomingRain > 20) {
    adviceEN = 'Heavy rain expected in the next 3 days. Delay fertilizer application and ensure proper drainage.';
    adviceTE = 'రాబోయే 3 రోజుల్లో భారీ వర్షం అంచనా. ఎరువుల వాడకాన్ని ఆలస్యం చేయండి మరియు సరైన డ్రైనేజీ నిర్ధారించండి.';
  } else if (currentTemp > 35) {
    adviceEN = 'High temperatures detected. Irrigate crops in early morning or evening. Consider mulching to retain soil moisture.';
    adviceTE = 'అధిక ఉష్ణోగ్రతలు గుర్తించబడ్డాయి. ఉదయం లేదా సాయంత్రం పంటలకు నీరు పెట్టండి. నేల తేమను నిలుపుకోవడానికి మల్చింగ్ పరిగణించండి.';
  } else if (currentRain > 0) {
    adviceEN = 'Rain is occurring now. Good time for planting if soil is prepared. Avoid spraying pesticides.';
    adviceTE = 'ప్రస్తుతం వర్షం పడుతోంది. నేల సిద్ధంగా ఉంటే నాటడానికి మంచి సమయం. పురుగుమందులు చల్లడం మానండి.';
  } else {
    adviceEN = 'Weather conditions are favorable for most farming activities. Monitor soil moisture regularly.';
    adviceTE = 'వాతావరణ పరిస్థితులు చాలా వ్యవసాయ కార్యకలాపాలకు అనుకూలంగా ఉన్నాయి. నేల తేమను క్రమం తప్పకుండా పర్యవేక్షించండి.';
  }

  return { en: adviceEN, te: adviceTE };
}
