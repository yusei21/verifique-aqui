export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const path = q.get('path') || 'deputados';
  if (!/^(deputados(?:\/\d+(?:\/(?:profissoes|orgaos))?)?|proposicoes(?:\/\d+(?:\/autores)?)?|votacoes(?:\/[\d-]+(?:\/votos)?)?)$/.test(path)) return Response.json({error:'Consulta inválida.'},{status:400});
  const url = new URL('https://dadosabertos.camara.leg.br/api/v2/'+path);
  for (const key of ['nome','idDeputadoAutor','ano','pagina','itens','ordem','ordenarPor','dataInicio','dataFim']) {
    const v=q.get(key); if(v) url.searchParams.set(key,v.slice(0,150));
  }
  try {
    const response = await fetch(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
    if(!response.ok) throw new Error('Fonte indisponível');
    return Response.json({...(await response.json() as Record<string,unknown>),source:url.toString(),consultedAt:new Date().toISOString()},{headers:{'Cache-Control':'public, max-age=300'}});
  } catch { return Response.json({error:'A Câmara não respondeu a esta consulta. Tente novamente em instantes.'},{status:502}); }
}
