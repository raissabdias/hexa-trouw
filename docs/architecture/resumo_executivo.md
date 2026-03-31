# Resumo Executivo: Transição Hexagonal 🚀

## Por que mudar agora?
Nosso ecossistema atual possui **três pontos de falha principais**:
1.  **Duplicação de Regras**: A mesma lógica de negócio (ex: validação de NF) está espalhada em 3 lugares (Web, API, MS).
2.  **Acoplamento com o Banco**: Se mudarmos a estrutura do banco, quebrarmos 3 sistemas diferentes.
3.  **Inconsistência**: Cada projeto manipula o banco de uma forma (Eloquent, SQL puro, etc).

## A Solução: Arquitetura Hexagonal
Inspirada no projeto `hexa-trouw`, a solução foca em:
*   **Independência de Framework**: O negócio não morre se mudarmos o framework.
*   **Testabilidade**: Conseguimos testar regras de negócio sem precisar subir o banco de dados.
*   **Flexibilidade**: Podemos trocar o MySQL por MongoDB (ou vice-versa) mudando apenas um "Adapter".

## Plano de Ação em 3 Passos:
1.  **Módulo Core**: Criar uma biblioteca PHP (ou NestJS) que contenha apenas as **Entidades** e **Casos de Uso**.
2.  **Unified Adapters**: Criar implementações padrão para os repositórios de banco de dados.
3.  **Strangler Migration**: Migrar funcionalidade por funcionalidade, começando pelas mais críticas.

---

> [!NOTE]
> Essa mudança não é apenas técnica, é uma mudança de **mindset**: primeiro pensamos no problema de negócio (Domínio), depois em como as tecnologias vão nos ajudar (Infraestrutura).
