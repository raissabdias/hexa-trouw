# Hexa Trouw API

Sistema especializado em planeamento logístico e gestão de rotas, desenvolvido com NestJS. O projeto aplica os princípios da Arquitetura Hexagonal para integrar uma camada de inteligência de transporte a um ecossistema de base de dados legado.

## Arquitetura

O sistema é estruturado seguindo o padrão Ports and Adapters (Arquitetura Hexagonal), garantindo que as regras de negócio sejam independentes de tecnologias externas:

* **Application**: Contém os Casos de Uso (Use Cases) que orquestram o fluxo de dados e aplicam as regras de negócio.
* **Domain**: Define as entidades de negócio, serviços de domínio e as Portas (Interfaces) que estabelecem os contratos de entrada e saída.
* **Infrastructure**: Implementa os Adaptadores (Adapters), incluindo a persistência com TypeORM, filtros de exceção globais e a comunicação externa via HTTP.

## Tecnologias

* **Runtime**: Node.js 20
* **Framework**: NestJS 11
* **Linguagem**: TypeScript
* **Base de Dados**: MySQL/PostgreSQL geridos via TypeORM
* **Documentação**: Swagger (OpenAPI)

## Módulos Principais

### Travels (Viagens)
Módulo responsável pelo planeamento de rotas e consolidação de carga:
* Integração com o microsserviço MS Cubing para otimização de trajetos.

### Invoices (Notas Fiscais)
Gestão de Notas Fiscais vinculadas ao fluxo logístico:
* Validação de duplicidade por número e empresa.
* Vínculo direto entre notas fiscais e destinatários cadastrados no sistema.

### Locations (Localizações)
Gestão de pontos geográficos e entidades associadas:
* Cadastro de referências com latitude e longitude.
* Integração com o módulo de Pessoas (Persons) para identificação de remetentes e destinatários.

## Padrões de Resposta

Todas as chamadas da API retornam um formato padronizado via Interceptor global:

**Sucesso (200/201):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": { "total": 0 }
}
```

**Erro (400/404/500):**
```json
{
  "success": false,
  "statusCode": 404,
  "timestamp": "2026-03-31T12:00:00.000Z",
  "path": "/endpoint",
  "message": "Description of the error",
  "error": "ErrorType"
}
```

## Execução do Projeto

O projeto está configurado para rodar em ambientes conteinerizados:

1. Certifique-se de que as variáveis de ambiente estão configuradas no .env.
2. Inicie os serviços via Docker Compose:

```json
docker-compose up --build
```

A API estará disponível na porta 3000. A documentação Swagger está disponível em:
http://localhost:3000/api/docs