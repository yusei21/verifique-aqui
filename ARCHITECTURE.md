# Arquitetura e plano de expansão

## Implementado nesta versão

```text
Busca por nome → seleção do ID da Câmara → /api/camara → API oficial
                                        ↓
                             perfil / propostas / votos / redes
                                        ↓
                             interface + origem + data de consulta
```

A interface React usa um identificador estável para não juntar homônimos. A rota de servidor restringe os recursos consultáveis, impõe timeout de 20 segundos e devolve a URL da fonte junto ao resultado. Falhas em consultas auxiliares não substituem dados por conteúdo inventado. Respostas antigas de uma ficha ou aba não sobrescrevem a seleção mais recente.

Proposições: consulta por autor, ano e página. O filtro inclui coautorias e não identifica automaticamente o primeiro signatário. Os links conduzem à ementa e tramitação oficiais.

Votos: busca as votações de um intervalo móvel de 30 dias, em páginas de 20 registros, e consulta os votos de cada registro. A identificação do parlamentar ocorre pelo ID, sem inferência por nome. Registros sem voto individual encontrado não são interpretados como ausência. Falhas parciais são apresentadas. A descrição da votação é preservada; um voto sobre parecer, emenda ou destaque não é convertido em uma conclusão sobre o projeto inteiro.

Redes: apenas endereços cadastrados na Câmara. Não há coleta de posts ou análise de discursos.

Não há banco de dados, indexação completa, coleta agendada, autenticação própria ou integração com IA implementados. A hospedagem privada utiliza o controle de acesso da plataforma de hospedagem.

## Arquitetura proposta para a versão completa

1. Coletores independentes para Câmara, Senado e TSE, com paginação completa, tarefas retomáveis e registro de sucesso ou falha.
2. Armazenamento dos documentos originais, URL, data da publicação, momento da coleta e hash do conteúdo.
3. Normalização de pessoas, mandatos, partidos, proposições, autoria, objetos de votação e votos individuais.
4. Busca por nome e filtros em dados indexados; IDs de cada fonte vinculados à pessoa após confirmação.
5. Notícias, casos e checagens por conectores específicos, respeitando disponibilidade de APIs, permissões e direitos de uso.
6. IA para extrair afirmações verificáveis e redigir explicações com referências; revisão editorial antes de publicar classificações e casos sensíveis.
7. API própria e interface com cobertura, fonte, período e atualização explícitos em cada registro.

Para uma implantação maior, PostgreSQL é uma opção para os registros e índices de busca; armazenamento de objetos preserva documentos originais; fila de tarefas organiza a coleta. A escolha e o provisionamento desses serviços ficam para a expansão, após definir o volume e as fontes.

## Modelo de dados proposto

| Entidade | Campos principais |
| --- | --- |
| Pessoa | ID interno, nome civil, nome parlamentar |
| Identificador de fonte | Pessoa, fonte, ID externo, evidência de vínculo |
| Mandato | Pessoa, cargo, casa, UF, início, fim, situação |
| Filiação | Pessoa, partido, início, fim, fonte |
| Proposição | Fonte, ID externo, tipo, número, ano, ementa, situação |
| Autoria | Pessoa, proposição, papel, ordem, fonte |
| Votação | ID externo, data, órgão, descrição, objeto efetivamente votado, resultado |
| Voto | Votação, pessoa, tipo de voto, documento original |
| Declaração | Pessoa, fala original, data, local, vídeo/texto, trecho verificável |
| Checagem | Declaração, organização, classificação da organização, evidências, método, revisão |
| Caso público | Pessoa, descrição, tipo, situação processual, datas, atualizações |
| Fonte | URL, título, publicador, publicação, coleta, hash |
| Execução de coleta | Fonte, cursor, início, fim, quantidade, erros |

## Regras de apresentação

- Não misturar pessoas só porque têm o mesmo nome; não publicar vínculos incertos.
- Não dizer “todas as propostas” antes de completar e verificar a paginação e o período.
- Distinguir ausência de informação, falha de coleta e registro explícito de ausência parlamentar.
- Separar autoria, coautoria, primeiro signatário, relatoria e apoio.
- Mostrar o objeto da votação antes de atribuir posição sobre uma política pública.
- Checagens reproduzem a classificação da organização responsável e o método; a IA não atribui um selo autônomo de mentira.
- Promessas e opiniões não são tratadas automaticamente como afirmações factuais falsas.
- Acusação, investigação, denúncia recebida, condenação, recurso e absolvição são situações diferentes, com datas e fontes.
- A ficha apresenta atuação pública documentada, sem inferir conduta privada ou atribuir culpa pela existência de uma notícia.

## Próximas etapas

1. Completar coleta histórica e paginação dos votos; verificar objetos de votação.
2. Integrar Senado e TSE com mapeamento seguro de identidade.
3. Implementar banco, proveniência e monitoramento de atualização.
4. Conectar checagens publicadas e discursos originais.
5. Criar processo editorial para controvérsias e situação processual.
6. Considerar comparação factual entre parlamentares, sempre com os mesmos períodos e cobertura.
