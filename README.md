# Verifique Aqui — Radar Público

Protótipo de consulta à atuação de deputados federais brasileiros, com fontes oficiais e limites de cobertura visíveis.

## Funcionalidades disponíveis

- Busca por nome parlamentar e escolha da pessoa pelo partido, estado e ID da Câmara.
- Perfil, profissão cadastrada, órgãos e comissões retornados pela Câmara.
- Proposições de autoria ou coautoria, com ementas, filtro por ano e paginação.
- Amostra paginada de votos individuais encontrados em até 20 votações por página nos últimos 30 dias.
- Links de redes sociais informados pela Câmara, quando existentes.
- Links das fontes e horário de consulta; estados de erro, carregamento e resultado vazio.
- Interface em português, adaptável ao celular.

**Esta versão não é um dossiê completo.** Não coleta publicações sociais, notícias, processos, patrimônio eleitoral nem checagens; não classifica discursos automaticamente. Não encontrar um voto na amostra não demonstra ausência, abstenção ou falta de atuação.

## Executar

Requer Node.js 22.13 ou superior. O projeto usa React, TypeScript e Vinext (compatibilidade com o App Router do Next.js), com saída para Cloudflare Workers.

```sh
npm run install:ci
npm run dev
```

Para verificar e gerar a aplicação:

```sh
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

`npm run start` serve a saída Worker gerada. Não há chave de IA ou conta obrigatória para a consulta à Câmara. A pasta `.openai` vincula a versão hospedada ao projeto Sites; não contém credenciais. As dependências estão fixadas em `pnpm-lock.yaml`.

## Fonte e metodologia

API: https://dadosabertos.camara.leg.br/api/v2

Documentação: https://dadosabertos.camara.leg.br/swagger/api.html

O endpoint `/api/camara` permite apenas caminhos definidos para a Câmara, mantém a origem e o horário da consulta e retorna erro quando a fonte não responde. Não oferece proxy para URLs arbitrárias. A aplicação não grava pesquisas nem mantém um banco de usuários. O cache HTTP tem duração de cinco minutos; a Câmara pode aplicar cache adicional.

Leia [ARCHITECTURE.md](ARCHITECTURE.md) para o fluxo implementado, o modelo proposto para expansão e as limitações.

## Validação da primeira versão

- TypeScript sem erros.
- Consultas reais validadas: pesquisa por nome, perfil, proposições, listagem de votações e endpoint de votos.
- Caminho inválido rejeitado com HTTP 400.
- A API de votos pode retornar uma lista vazia, especialmente em votações sem registro individual.
- A infraestrutura de prévia visual não esteve disponível nesta execução; a interface não recebeu verificação visual em navegador.
