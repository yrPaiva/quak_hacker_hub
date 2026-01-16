import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startIndex = searchParams.get('startIndex') || '0';
  
  // Pegar os ultimos 10 dias
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 1); 

  const pubStartDate = past.toISOString();
  const pubEndDate = now.toISOString();

  try {
    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=10&startIndex=${startIndex}`;
    
    const res = await fetch(url, { 
      next: { revalidate: 3600 }, // Cache de 1 hora para performance
      headers: {
        'User-Agent': 'QuakSec-Investigation-Portal'
      }
    });

    if (!res.ok) throw new Error(`NIST API Error: ${res.status}`);

    const data = await res.json();

    const formattedCVEs = data.vulnerabilities.map((item: any) => {
      const cve = item.cve;
      const metrics = cve.metrics?.cvssMetricV31?.[0]?.cvssData || 
                      cve.metrics?.cvssMetricV30?.[0]?.cvssData || {};
      
      return {
        id: cve.id,
        description: cve.descriptions.find((d: any) => d.lang === 'en')?.value || 'Descrição indisponível.',
        severity: metrics.baseSeverity || 'LOW',
        score: metrics.baseScore || 0,
        published: cve.published, 
      };
    });
    console.log("CVE Processada:", formattedCVEs);

    return NextResponse.json({ 
      cves: formattedCVEs, 
      totalResults: data.totalResults 
    });
  } catch (error) {
    console.error("Erro no fetch da NIST:", error);
    return NextResponse.json({ error: 'Falha ao sincronizar vulnerabilidades' }, { status: 500 });
  }
}