import { NextResponse } from 'next/server';

const cleanDescription = (html: string) => html.replace(/<\/?[^>]+(>|$)/g, "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });

  const API_KEY = process.env.HIBP_API_KEY; 

  try {
    const response = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
      {
        method: 'GET',
        headers: {
          'hibp-api-key': API_KEY as string,
          'user-agent': 'DeepScan-App-Yan', 
        },
      }
    );

    if (response.status === 404) {
      return NextResponse.json({
        success: true,
        mode: "SAFE",
        breaches: [],
        riskScore: 0
      });
    }

    // STATUS 429: Limite de 10 buscas por minuto atingido
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after') || '60';
      return NextResponse.json({ 
        mode: 'RATE_LIMIT', 
        retryAfter: parseInt(retryAfter),
        message: "Limite de 10 buscas atingido. Colocando na fila..." 
      }, { status: 429 });
    }

    if (!response.ok) throw new Error("API_ERROR");

    const realLeaks = await response.json();

    // MODO NOT_SAFE
    const formattedBreaches = realLeaks.map((leak: any) => {
      return {
        site: leak.Name,
        date: leak.BreachDate,
        records: leak.PwnCount.toLocaleString(),
        severity: leak.DataClasses.includes("Passwords") ? "critical" : "high",
        description: cleanDescription(leak.Description),
        
        passwordHint: leak.DataClasses.includes("Passwords") ? '********' : null,

        isRecent: leak.BreachDate.includes("2025") || leak.BreachDate.includes("2026"),
        
        leakedData: leak.DataClasses 
      };
    });

    return NextResponse.json({
      success: true,
      mode: "NOT_SAFE",
      breaches: formattedBreaches,
      riskScore: Math.min(formattedBreaches.length * 15, 100),
      open_source_leaks: '' 
    });

  } catch (error: any) {
    // FALLBACK: Se a API der erro ou bater o limite de 10/min, mostra os Mocks
    return NextResponse.json({
      success: true,
      mode: "DEMO",
      breaches: '',
      riskScore: 45,
      open_source_leaks: '',
      message: error.message === "RATE_LIMIT_EXCEEDED" 
        ? "Motor aquecido (10/min). Exibindo dados de simulação." 
        : "Serviço de inteligência offline. Modo demonstração ativo."
    });
  }
}
