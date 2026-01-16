export async function GET() {
  try {
    const response = await fetch('https://haveibeenpwned.com/api/v3/breaches');
    const data = await response.json();

    const formatted = data.map((leak: any) => ({
      site: leak.Title,
      domain: leak.Domain,
      logoName: leak.LogoPath,
      date: leak.BreachDate,
      description: leak.Description.replace(/<\/?[^>]+(>|$)/g, ""),
      records: leak.PwnCount.toLocaleString('pt-BR'),
      leakedData: leak.DataClasses,
    }));

    return Response.json(formatted);
  } catch (error) {
    return Response.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}