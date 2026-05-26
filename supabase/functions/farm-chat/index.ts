
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FARMING_SYSTEM_PROMPT = `You are an expert agricultural advisor for Indian farmers, especially those in Telangana and Andhra Pradesh. You provide helpful, accurate, and practical farming advice.

Your expertise includes:
- Crop selection and recommendations based on soil, climate, and season
- Crop disease identification and treatment suggestions
- Fertilizer and irrigation optimization
- Market price guidance and selling strategies
- Weather-based farming decisions
- Government schemes and subsidies for farmers
- Sustainable and organic farming practices

Guidelines:
1. Give concise, actionable advice
2. Use simple language that farmers can understand
3. Provide specific quantities, timings, and methods when possible
4. Consider local conditions in India
5. Mention relevant government schemes when applicable
6. Be supportive and encouraging

If asked in Telugu, respond in Telugu. Otherwise, respond in English.

Current date: ${new Date().toLocaleDateString('en-IN')}`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'en' } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing farm chat request with', messages.length, 'messages');

    const systemPrompt = language === 'te'
      ? FARMING_SYSTEM_PROMPT + '\n\nIMPORTANT: Respond in Telugu language.'
      : FARMING_SYSTEM_PROMPT;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Streaming response from AI gateway');

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error: unknown) {
    console.error('Farm chat error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
