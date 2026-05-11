# WaCleaner

<p align="center">
  <img src="assets/favicon.png" alt="WaCleaner logo" width="120">
</p>

<p align="center">
  <h1 align="center">WaCleaner V1.0</h1>
  <strong>Uma extensão para Firefox que limpa em massa arquivos de conversas do WhatsApp Web.</strong>
</p>

---

## Sobre

O **WaCleaner** automatiza a tarefa tediosa de apagar imagens, áudios, documentos, figurinhas e links de uma conversa no [WhatsApp Web](https://web.whatsapp.com). Em vez de selecionar mensagem por mensagem, você escolhe os tipos de conteúdo que deseja remover e a extensão faz todo o trabalho por você, rolando o histórico, selecionando as mensagens correspondentes e apagando apenas para você.

## Funcionalidades

A extensão permite limpar, de forma seletiva, os seguintes tipos de mídia da conversa atualmente aberta:

- 🖼️ **Imagens**
- 📄 **Documentos**
- 🔗 **Links**
- 🎨 **Figurinhas**
- 🎙️ **Áudios** (mensagens de voz)

Você pode marcar uma ou várias categorias ao mesmo tempo. A limpeza usa a opção **"Apagar para mim"** do WhatsApp, ou seja, as mensagens continuam visíveis para os outros participantes da conversa.

## Como funciona

1. A interface (popup) lista as categorias de mídia disponíveis com checkboxes.
2. Ao clicar em **"Limpar conversa atual"**, a sidebar envia as opções selecionadas para o `background.js`.
3. O background script injeta o `content/cleaner.js` na aba do WhatsApp Web e executa a função `main`.
4. O cleaner:
   - Cobre a página com um overlay informando que a limpeza está em andamento.
   - Rola a conversa até o início para carregar todo o histórico.
   - Ativa o modo de seleção de mensagens do WhatsApp.
   - Percorre as mensagens identificando aquelas que correspondem aos tipos selecionados (via atributos `data-testid` e `aria-label`) e as marca.
   - Aciona o botão **Apagar** e confirma com **Apagar para mim**.

## Instalação

Como a extensão ainda não está publicada na loja, ela precisa ser carregada usando o arquivo `.xpi`

1. Clone ou baixe este repositório;
2. Abra o Firefox e acesse `about:addons`;
3. Clique na engrenagem;
4. Selecione o arquivo `.xpi`;
5. Abra o [WhatsApp Web](https://web.whatsapp.com);
6. Clique no ícone do WaCleaner na barra de extensões para abrir o popup.

## Como usar

1. Abra a conversa que deseja limpar no WhatsApp Web;
2. Clique no ícone da extensão;
3. Marque as categorias de mídia que deseja apagar;
4. Clique em **Limpar conversa atual**.
5. Aguarde sem fechar a aba — um overlay verde com a mensagem *"Limpando — Não feche essa aba!"* será exibido durante o processo.

## Estrutura do projeto

```
WaCleaner/
├── assets/
│   ├── favicon.png        # Ícone da extensão
│   └── wa-bg.png          # Imagem de fundo do popup
├── builds/
│   ├── v1.0.xpi           # Arquivo contendo a extensão
├── content/
│   └── cleaner.js         # Script injetado no WhatsApp Web
├── sidebar/
│   ├── sidebar.html       # Interface do popup
│   ├── sidebar.css        # Estilos do popup
│   └── sidebar.js         # Lógica do popup
├── background.js          # Service worker da extensão
└── manifest.json          # Manifesto da extensão (MV3)
```

## Requisitos técnicos

- **Manifest:** v3
- **Navegador:** Firefox 115+
- **Permissões:** `tabs`, `scripting`
- **Host permissions:** `https://web.whatsapp.com/*`
- **Coleta de dados:** nenhuma

## Limitações

- A extensão depende dos seletores e textos da interface em **português brasileiro** do WhatsApp Web (ex.: `aria-label="Mais opções"`, `aria-label="Apagar"`, "Apagar para mim"). Caso seu idioma esteja diferente, os seletores podem não corresponder.
- Como o WhatsApp Web pode mudar sua estrutura DOM sem aviso, a extensão pode parar de funcionar até receber atualizações nos seletores.
- A limpeza é aplicada apenas à conversa atualmente aberta.

## Autor

Feito com ❤️ por [**Lucas Siqueira**](https://www.linkedin.com/in/lucasdesouzasiqueira/) para alguém muito especial :)