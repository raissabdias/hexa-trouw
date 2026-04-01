# Arquitetura Hexagonal — Guia Completo e Didático

> Projeto: **hexa-trouw** (NestJS + TypeScript)

---

## O Problema que a Arquitetura Hexagonal Resolve

Imagine um sistema onde:

- A lógica de negócio está misturada com código de banco de dados
- Trocar de framework significa reescrever tudo
- Testar regras de negócio exige subir o banco de dados
- A mesma regra existe duplicada em 3 projetos diferentes

A Arquitetura Hexagonal (também chamada **Ports and Adapters**) resolve tudo isso com **uma ideia simples**:

> **A lógica de negócio não pode depender de nada externo.**

---

## As Três Camadas

```
┌─────────────────────────────────────────────────────────┐
│                  INFRAESTRUTURA                          │
│  Controllers · Repositories · External APIs · Entities   │
│  (sabe tudo: HTTP, TypeORM, APIs externas, etc.)         │
└────────────────────────┬────────────────────────────────┘
                         │ depende de
┌────────────────────────▼────────────────────────────────┐
│                  APLICAÇÃO                               │
│  Use Cases (Casos de Uso)                                │
│  (orquestra: recebe comando → chama domínio → retorna)   │
└────────────────────────┬────────────────────────────────┘
                         │ depende de
┌────────────────────────▼────────────────────────────────┐
│                  DOMÍNIO                                 │
│  Entities · Value Objects · Domain Services · Ports      │
│  (não sabe NADA do mundo exterior)                       │
└─────────────────────────────────────────────────────────┘
```

### Regra de Ouro: Dependência aponta SEMPRE para dentro

```
  Infraestrutura ──► Aplicação ──► Domínio
       ❌              ❌              ✅
  (não pode        (não pode      (não depende
   apontar para     apontar para    de ninguém)
   fora)            fora)
```

---

## 3. Ports & Adapters — O Conceito Central

### Port (Porta) = Interface

O domínio **declara o que precisa**, sem dizer como será feito:

```typescript
// domain/ports/travel-repository.port.ts
// "Eu preciso de um jeito de salvar viagens"
export interface TravelRepositoryPort {
  save(travel: Partial<TravelEntity>): Promise<TravelEntity>;
  findById(id: number, companyId: number): Promise<TravelEntity | null>;
  findAll(
    page: number,
    limit: number,
    companyId: number,
  ): Promise<{ data: TravelEntity[]; total: number }>;
  update(id: number, data: Partial<TravelEntity>): Promise<void>;
}
```

### Adapter (Adaptador) = Implementação

A infraestrutura **implementa o como**, usando tecnologia concreta:

```typescript
// infrastructure/persistence/adapters/typeorm-travel-repository.adapter.ts
// "Eu sei salvar no MySQL usando TypeORM"
@Injectable()
export class TypeOrmTravelRepositoryAdapter implements TravelRepositoryPort {
  constructor(
    @InjectRepository(TravelEntity)
    private readonly repository: Repository<TravelEntity>,
  ) {}

  async save(travel: Partial<TravelEntity>): Promise<TravelEntity> {
    const newTravel = this.repository.create(travel);
    return await this.repository.save(newTravel);
  }
  // ... outros métodos
}
```

### Wiring (Conexão) — O Módulo

O `Module` conecta tudo via injeção de dependência:

```typescript
// travels.module.ts
providers: [
  CreateTravelUseCase,
  {
    provide: 'TravelRepositoryPort', // ← A PORTA
    useClass: TypeOrmTravelRepositoryAdapter, // ← O ADAPTADOR
  },
];
```

**Resultado:** O Use Case usa a **Porta**, o Module injeta o **Adaptador**. Se amanhã quisermos trocar TypeORM por Prisma, mudamos **apenas o adapter**. O domínio e os casos de uso **não mudam nada**.

---

## Fluxo Completo — Da Requisição ao Banco

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  CLIENT  │────►│  CONTROLLER  │────►│  USE CASE    │────►│  PORT        │────►│ ADAPTER  │
│ (HTTP)   │     │ (Infra)      │     │ (Aplicação)  │     │ (Interface)  │     │ (Infra)  │
└──────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └────┬─────┘
                                                                                     │
                                                                                     ▼
                                                                              ┌──────────┐
                                                                              │  MySQL   │
                                                                              └──────────┘
```

---

## Diagrama Geral da Arquitetura

```
                    ┌──────────────────────────────────────────────┐
                    │                 CLIENTE                       │
                    │         (Postman / Frontend / App)            │
                    └─────────────────────┬────────────────────────┘
                                          │ HTTP + JSON
                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          HEXA-TROUW API                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  CAMADA DE INFRAESTRUTURA                                          │  │
│  │                                                                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │  │
│  │  │  Controllers │  │   Entities   │  │      External APIs       │ │  │
│  │  │  (HTTP)      │  │  (TypeORM)   │  │  (MS Cubing Router)      │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘ │  │
│  │         │                 │                        │               │  │
│  └─────────┼─────────────────┼────────────────────────┼───────────────┘  │
│            │                 │                        │                  │
│  ┌─────────▼─────────────────▼────────────────────────▼───────────────┐  │
│  │  CAMADA DE APLICAÇÃO                                               │  │
│  │                                                                     │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │                    USE CASES                                  │  │  │
│  │  │  CreateTravel · ListTravels · GetTravelById · DeleteTravel   │  │  │
│  │  │  CreateLocation · ListLocations · GetLocationByPerson        │  │  │
│  │  │  CreateInvoice · ListInvoices · GetInvoiceById               │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  └────────────────────────────┬────────────────────────────────────────┘  │
│                               │                                           │
│  ┌────────────────────────────▼────────────────────────────────────────┐  │
│  │  CAMADA DE DOMÍNIO                                                  │  │
│  │                                                                      │  │
│  │  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────────┐ │  │
│  │  │  Domain      │  │  Ports           │  │  Domain Services      │ │  │
│  │  │  Models      │  │  (Interfaces)    │  │  (Regras de Negócio)  │ │  │
│  │  │              │  │                  │  │                       │ │  │
│  │  │  Location    │  │  TravelRepoPort  │  │  TravelLogicService   │ │  │
│  │  └──────────────┘  │  LocationRepoPort│  └───────────────────────┘ │  │
│  │                    │  InvoiceRepoPort │                            │  │
│  │                    │  RouterExtPort   │                            │  │
│  │                    └──────────────────┘                            │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                    ┌──────────────────────────────────────────────┐
                    │              MySQL Database                   │
                    │  tb_planejamento_rotas · tb_locations · etc.  │
                    └──────────────────────────────────────────────┘
```

---

## Como Criar uma Nova Funcionalidade

Siga esta ordem (de dentro para fora):

### Passo 1: Domínio

```
1. Crie a Entity/Model de domínio (regras de negócio)
2. Crie as Ports (interfaces) que o domínio precisa
```

### Passo 2: Aplicação

```
3. Crie o Use Case (caso de uso)
   - Recebe as Ports via injeção de dependência
   - Contém toda a lógica de orquestração
   - Não sabe se o banco é MySQL, Postgres ou MongoDB
```

### Passo 3: Infraestrutura

```
4. Crie o Adapter que implementa a Port
5. Crie o Controller (HTTP endpoint)
6. Crie os DTOs (request/response)
7. Crie a Entity do TypeORM (se precisar de banco)
```

### Passo 4: Wiring

```
8. Registre tudo no Module:
   - Controllers
   - Use Cases
   - Providers (Port → Adapter)
```

## Benefícios Concretos

| Benefício                      | Como funciona                                           |
| ------------------------------ | ------------------------------------------------------- |
| **Testabilidade**              | Teste Use Cases mockando as Ports — sem banco de dados  |
| **Troca de tecnologia**        | Troque TypeORM por Prisma mudando apenas o Adapter      |
| **Independência de framework** | O domínio não sabe que NestJS existe                    |
| **Reuso de lógica**            | Use Cases podem ser chamados por HTTP, CLI, filas, etc. |
| **Manutenibilidade**           | Cada camada tem responsabilidade clara e isolada        |


## Padrões Importantes Aplicados

### Dependency Inversion

O Use Case depende de **interfaces** (Ports), não de implementações concretas:

```typescript
// ✅ CORRETO: depende da interface
constructor(
    @Inject('TravelRepositoryPort')
    private readonly travelRepo: TravelRepositoryPort
) {}

// ❌ ERRADO: dependeria da implementação concreta
constructor(
    private readonly travelRepo: TypeOrmTravelRepositoryAdapter
) {}
```

> **Mentalidade:** Primeiro pensamos no problema de negócio (Domínio), depois em como as tecnologias vão nos ajudar (Infraestrutura).
