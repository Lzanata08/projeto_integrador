# Projeto Integrador - Gerenciador hospitalar

- Projeto backEnd e FrontEnd para gerenciar consultas de um hospital.
  
# Objetivo
- O projeto teve como principal objetivo aplicar os conceitos de deselvolvimento de software adquiridos durante o curso técnico.

---

## ✨ Funcionalidades Principais

- **Telas para gerenciar pacientes com cadastrar, listar, alterar e excluir.
- **Telas para gerenciar medicos com cadastrar, listar, alterar e excluir.
-  **Telas para gerenciar consultas com cadastrar, listar, alterar e excluir.
-  **Tela principal para listagem geral.
---

## 🛠️ Tecnologias Utilizadas

- **Java 17**: Versão mais recente da linguagem Java.
- **Spring Boot 3.5.6**: Framework principal para a construção da aplicação.
- **Spring MVC**: Para as camadas de model view controller.
- **Spring Data JPA**: Para a persistência de dados com o banco de dados.
- **Maven**: Gerenciador de dependências e build do projeto.
- **MySql**: Banco de dados relacional para o ambiente de produção.
- **Swagger (OpenAPI 3)**: Para documentação interativa da API.
- **Postman: Para testes de integração.
- **VScode: Para desenvolvimento FrontEnd.
- **jQuery: Para integrção com backEnd.
- **Netbeans: para desenvolvimento do backEnd

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar a aplicação em seu ambiente local.

### 1. Pré-requisitos

- **JDK 17** (ou superior)
- **Apache Maven 3.9+**

### 2. Configuração do Ambiente

### 3. Executando a Aplicação

Com as variáveis de ambiente configuradas, execute o seguinte comando na raiz do projeto:

```bash
# No Windows
./mvnw spring-boot:run

# No Linux ou macOS
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

---

## 📚 Documentação da API (Swagger)

Após iniciar a aplicação, a documentação completa e interativa da API, gerada com Swagger, pode ser acessada no seu navegador através do seguinte endereço:

[**http://localhost:8080/swagger-ui/index.html**](http://localhost:8080/swagger-ui/index.html)

Lá você encontrará todos os endpoints, seus parâmetros, corpos de requisição e respostas, além de poder testá-los diretamente.

---

## ✅ Executando os Testes

O projeto possui uma suíte de testes unitários e de integração para garantir a qualidade e o correto funcionamento do código. Para executar todos os testes, utilize o comando:

```bash
# No Windows
./mvnw test

# No Linux ou macOS
./mvnw test
```
