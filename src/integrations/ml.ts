// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCropRecommendation(soilType: string, weather: any) {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      soil_type: soilType,
      weather: weather,
    }),
  });

  if (!response.ok) {
    throw new Error("ML prediction failed");
  }

  return await response.json();
}