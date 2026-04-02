# Agentes

## Stack

- NestJS com TypeORM
- Banco de dados PostgreSQL
- Autenticação JWT
- Swagger para documentação
- Arquitetura Hexagonal (Ports and Adapters)

## Estrutura de Pastas

```
src/modules/<module>/
├── application/
│   └── use-cases/
│       ├── create-<module>.use-case.ts
│       ├── list-<module>.use-case.ts
│       └── get-<module>-by-id.use-case.ts
├── domain/
│   ├── models/
│   │   └── <module>.model.ts
│   └── ports/
│       └── <module>-repository.port.ts
└── infrastructure/
    ├── controllers/
    │   ├── <module>.controller.ts
    │   └── dto/
    │       ├── create-<module>.dto.ts
    │       └── <module>-response.dto.ts
    └── persistence/
        ├── adapters/
        │   └── typeorm-<module>-repository.adapter.ts
        ├── entities/
        │   └── <module>.entity.ts
        └── mappers/
            └── <module>.mapper.ts
```

## Padrões

###命名Convention (Naming)

- Use cases: `<action>-<module>.use-case.ts` (ex: `create-region.use-case.ts`)
- Adapter: `typeorm-<module>-repository.adapter.ts`
- Entity: `<module>.entity.ts`
- Port: `<module>-repository.port.ts`
- Controller: `<module>.controller.ts`
- DTOs: `<action>-<module>.d.ts` ou `<module>-response.dto.ts`

### Padrão de Commit

- `feat(<module>): description` - nova funcionalidade
- `fix(<module>): description` - correção de bug
- `refactor(<module>): description` - refatoração
- `docs(<module>): description` - documentação

### Camadas (Layers)

1. **Controller** (Infraestrutura HTTP) - Recebe requisições, valida DTOs, chama use cases
2. **Use Case** (Aplicação) - Orquestra lógica de negócio, obtém dados do config service
3. **Port** (Domínio) - Interface abstrata que define contrato
4. **Adapter** (Infraestrutura) - Implementação concreta (TypeORM)

### dependency Injection

- Usar `@Inject('ModuleRepositoryPort')` para injetar portas nos use cases
- No module, configurar provider com `provide: 'ModuleRepositoryPort', useClass: TypeOrmModuleRepositoryAdapter`

### Entity

- Usar `@PrimaryGeneratedColumn()` para ID
- Usar `active: 'S'` ou `isActive: 1` para soft delete
- Relations usam snake_case (ex: `pess_nome`, `refe_descricao`)

### Response

- Controller retorna Use Case result diretamente
- Usar `@ApiResponse` do Swagger para documentação
- Usar `@ApiBearerAuth('access-token')` para autenticação

## Commands

- `npm run build` - Compila o projeto
- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run test` - Executa testes unitários
