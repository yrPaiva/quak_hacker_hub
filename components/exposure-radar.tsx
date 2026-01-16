"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface ExposureRadarProps {
  score: number;
  breaches: any[];
}

export function ExposureRadar({ score, breaches = [] }: ExposureRadarProps) {
  
  // Função para calcular a intensidade de cada categoria nos dados reais
  const calculateIntensity = (keyword: string) => {
    if (breaches.length === 0) return 10;
    // Conta em quantos vazamentos essa categoria aparece
    const occurrences = breaches.filter(b => 
      b.leakedData?.some((d: string) => d.toLowerCase().includes(keyword.toLowerCase()))
    ).length;
    
    // Normaliza para uma escala de 0 a 100
    const intensity = (occurrences / breaches.length) * 100;
    return Math.max(intensity, 15); // Mantém um mínimo para o gráfico não sumir
  };

  const dynamicData = [
    { category: "Senhas", value: calculateIntensity("Password") },
    { category: "E-mails", value: calculateIntensity("Email") },
    { category: "Redes Sociais", value: calculateIntensity("Social") },
    { category: "Endereço IP", value: calculateIntensity("IP address") },
    { category: "Telefones", value: calculateIntensity("Phone") },
    { category: "Info Pessoal", value: calculateIntensity("Name") || calculateIntensity("Date of birth") },
  ];

  const radarColor = score > 70 ? "#ff0040" : score > 30 ? "#facc15" : "#00ff41";

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={dynamicData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        
        <PolarGrid stroke="#00ff41" strokeOpacity={0.1} />
        
        <PolarAngleAxis 
          dataKey="category" 
          tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }} 
        />
        
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={false} 
          axisLine={false} 
        />
        
        <Radar
          name="Nível de Exposição"
          dataKey="value"
          stroke={radarColor} 
          fill={radarColor}
          fillOpacity={0.2}
          strokeWidth={2}
          animationDuration={1500}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}