# Frontend de Chatbot para OCI Generative AI + n8n

<img width="1686" height="922" alt="image" src="https://github.com/user-attachments/assets/6b044279-13ee-477c-8f96-8871d737ee4e" />

Este repositório contém o código-fonte de um frontend de chatbot elegante e responsivo, projetado para se integrar com qualquer backend de IA via [n8n](https://n8n.io/). A interface foi construída seguindo o sistema de design [Redwood da Oracle](https://redwood.oracle.com/), garantindo uma experiência de usuário limpa, moderna e profissional, ideal para demonstrar o poder da [Oracle Cloud Infrastructure (OCI) Generative AI](https://www.oracle.com/br/artificial-intelligence/generative-ai/).

Este projeto foi criado como uma solução "plug-and-play": basta configurar a URL do seu webhook do n8n e começar a conversar.

## Features

*   **Design Redwood Profissional:** Interface inspirada nos padrões visuais da Oracle para uma aparência corporativa e polida.
*   **Integração Flexível:** Conecta-se a qualquer workflow do n8n que aceite uma requisição `POST` com um JSON `{ "prompt": "..." }`.
*   **Configuração Dinâmica:** Um modal de configurações permite que o usuário insira e salve a URL do webhook diretamente na interface, sem precisar alterar o código.
*   **Componentes Modernos:**
    *   Interface de chat com scroll automático.
    *   Exibição separada para mensagens do usuário e do bot.
    *   Indicador de "pensando..." enquanto o backend processa a resposta.
*   **Zero Dependências:** Construído com HTML, CSS e JavaScript puros, sem a necessidade de frameworks, o que o torna extremamente leve e fácil de hospedar.
*   **Pronto para Demonstração:** Ideal para artigos, workshops ou provas de conceito (PoCs) que envolvem IA Generativa.

##  Como Executar o Projeto

Para rodar este frontend localmente, você só precisa de um servidor web simples.

**Clone o Repositório**
    ```bash
    git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
    cd SEU-REPOSITORIO
    ```
**Acesse no Navegador**
    O terminal mostrará uma URL local, geralmente `http://localhost:3000`. Abra este endereço no seu navegador.

4.  **Configure o Webhook**
    *   Clique no botão **"Configurar Webhook"** no canto superior direito.
    *   Cole a **URL de Produção** do seu workflow do n8n.
    *   Clique em "Salvar". A URL ficará salva no seu navegador para futuras visitas.

Configuração do Backend (n8n)

Este frontend foi projetado para funcionar com um workflow específico no n8n. O fluxo deve seguir esta estrutura:

1.  **Nó de Gatilho (Trigger): `Webhook`**
    *   **HTTP Method:** `POST`
    *   **Respond:** `When Last Node Finishes`
    *   Este nó receberá um JSON no formato: `{ "prompt": "A pergunta do usuário" }`

2.  **Nó de Processamento: `OCI Generative AI`**
    *   Este nó deve receber o prompt da etapa anterior usando a expressão `{{ $json.body.prompt }}`.
    *   Ele se conecta à sua instância da OCI GenAI e gera a resposta.

3.  **Nó de Formatação: `Edit Fields` (ou `Set`)**
    *   Este nó deve formatar a saída para garantir que o frontend receba uma resposta consistente.
    *   Configure-o para criar um único campo:
        *   **Key:** `answer`
        *   **Value:** `{{ $json.text }}` (ou o caminho para o texto de resposta gerado pelo nó da OCI).

O workflow final deve ser: `[Webhook] -> [OCI GenAI] -> [Edit Fields]`

> **Importante:** Lembre-se de ativar seu workflow no n8n e usar a **URL de Produção** no frontend.

## Estrutura dos Arquivos

*   `index.html`: A estrutura de conteúdo da aplicação.
*   `style.css`: Toda a estilização, cores, fontes e layout (o design Redwood).
*   `script.js`: O "cérebro" da aplicação. Lida com o envio de mensagens, a comunicação com o n8n e a manipulação da interface.
*   `oracle_logo.png`: Logo principal da Oracle para o cabeçalho.
*   `OCI_genAI.png`: Logo do serviço OCI Generative AI.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
