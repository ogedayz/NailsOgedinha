/**
 * Chatbot Autônomo com Botão Ajustado
 * Ateliê Juliana Ogeda
 */
(function () {
  if (window.chatbotInicializado) return;
  window.chatbotInicializado = true;

  const cssStyles = `
    #faq-chatbot-widget {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 9999999 !important;
      font-family: 'DM Sans', sans-serif !important;
    }

    #faq-toggle-btn {
      width: 48px !important;
      height: 48px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #d4af37, #9d7718) !important;
      color: #111 !important;
      border: none !important;
      box-shadow: 0 6px 18px rgba(0,0,0,0.3) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 18px !important;
      font-weight: bold !important;
      transition: transform 0.2s ease !important;
    }

    #faq-toggle-btn:hover {
      transform: scale(1.08) !important;
    }

    #faq-chat-window {
      position: fixed !important;
      bottom: 80px !important;
      right: 20px !important;
      width: 340px !important;
      max-width: calc(100vw - 40px) !important;
      height: 480px !important;
      background-color: #faf8f3 !important;
      border-radius: 18px !important;
      border: 1px solid rgba(212,175,55,0.3) !important;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3) !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      transition: all 0.3s ease !important;
    }

    .faq-hidden {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .faq-header {
      background: #09090b !important;
      color: #ffffff !important;
      padding: 14px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      border-bottom: 2px solid #d4af37 !important;
    }

    .faq-header h3 {
      margin: 0 !important;
      font-size: 13px !important;
      color: #ffffff !important;
      font-weight: 600 !important;
    }

    .faq-close-icon {
      background: transparent !important;
      border: none !important;
      color: #ffffff !important;
      font-size: 16px !important;
      cursor: pointer !important;
    }

    #faq-messages {
      flex: 1 !important;
      padding: 14px !important;
      overflow-y: auto !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
    }

    .faq-msg {
      max-width: 85% !important;
      padding: 9px 12px !important;
      border-radius: 12px !important;
      font-size: 12.5px !important;
      line-height: 1.4 !important;
      white-space: pre-line !important;
    }

    .faq-msg.bot {
      align-self: flex-start !important;
      background: #ffffff !important;
      color: #09090b !important;
      border: 1px solid #e9e6df !important;
    }

    .faq-msg.user {
      align-self: flex-end !important;
      background: #d4af37 !important;
      color: #09090b !important;
      font-weight: 600 !important;
    }

    .faq-options {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
    }

    .faq-chip {
      background: #ffffff !important;
      border: 1px solid #d4af37 !important;
      padding: 7px 10px !important;
      border-radius: 10px !important;
      font-size: 11.5px !important;
      cursor: pointer !important;
      text-align: left !important;
      font-weight: 600 !important;
      transition: all 0.2s !important;
    }

    .faq-chip:hover {
      background: #d4af37 !important;
      color: #111 !important;
    }

    .faq-footer {
      padding: 10px !important;
      background: #ffffff !important;
      border-top: 1px solid #e9e6df !important;
    }

    .faq-input-area {
      display: flex !important;
      gap: 6px !important;
    }

    #faq-input {
      flex: 1 !important;
      padding: 8px 12px !important;
      border: 1px solid #ccc !important;
      border-radius: 20px !important;
      font-size: 12px !important;
      outline: none !important;
    }

    #faq-send-btn {
      background: #09090b !important;
      color: #d4af37 !important;
      border: none !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      cursor: pointer !important;
    }
  `;

  const htmlTemplate = `
    <button id="faq-toggle-btn" type="button" title="Atendimento">💬</button>
    <div id="faq-chat-window" class="faq-hidden">
      <div class="faq-header">
        <h3>✦ Juliana Ogeda | Atendimento</h3>
        <button type="button" id="faq-close-btn" class="faq-close-icon">✕</button>
      </div>
      <div id="faq-messages"></div>
      <div class="faq-footer">
        <div class="faq-input-area">
          <input type="text" id="faq-input" placeholder="Digite sua dúvida..." />
          <button type="button" id="faq-send-btn">➔</button>
        </div>
      </div>
    </div>
  `;

  let baseConhecimento = [];

  window.initChatbot = function (opcoes = {}) {
    if (document.getElementById("faq-chatbot-widget")) return;

    const styleTag = document.createElement("style");
    styleTag.textContent = cssStyles;
    document.head.appendChild(styleTag);

    const container = document.createElement("div");
    container.id = "faq-chatbot-widget";
    container.innerHTML = htmlTemplate;
    document.body.appendChild(container);

    const toggleBtn = document.getElementById("faq-toggle-btn");
    const closeBtn = document.getElementById("faq-close-btn");
    const chatWindow = document.getElementById("faq-chat-window");
    const messagesBox = document.getElementById("faq-messages");
    const sendBtn = document.getElementById("faq-send-btn");
    const input = document.getElementById("faq-input");

    function addMessage(texto, tipo) {
      const div = document.createElement("div");
      div.className = `faq-msg ${tipo}`;
      div.innerHTML = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      messagesBox.appendChild(div);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    function carregarMenuInicial() {
      messagesBox.innerHTML = "";
      addMessage("Olá! Seja bem-vinda ao Ateliê Juliana Ogeda. ✦ Como posso te ajudar?", "bot");

      if (baseConhecimento.length > 0) {
        const optsContainer = document.createElement("div");
        optsContainer.className = "faq-options";
        baseConhecimento.forEach(item => {
          const btn = document.createElement("button");
          btn.className = "faq-chip";
          btn.innerText = item.pergunta;
          btn.addEventListener("click", () => {
            addMessage(item.pergunta, "user");
            setTimeout(() => addMessage(item.resposta, "bot"), 200);
          });
          optsContainer.appendChild(btn);
        });
        messagesBox.appendChild(optsContainer);
      }
    }

    function normalizarTexto(txt) {
      return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function buscarResposta(textoUsuario) {
      const queryNorm = normalizarTexto(textoUsuario);
      let melhorMatch = null;
      let maiorPontuacao = 0;

      baseConhecimento.forEach(item => {
        let pontos = 0;
        const pergunta = normalizarTexto(item.pergunta || "");
        if (pergunta.includes(queryNorm)) pontos += 10;
        if (item.keywords) {
          item.keywords.forEach(kw => {
            if (queryNorm.includes(normalizarTexto(kw))) pontos += 5;
          });
        }
        if (pontos > maiorPontuacao) {
          maiorPontuacao = pontos;
          melhorMatch = item;
        }
      });

      return melhorMatch && maiorPontuacao >= 3 
        ? melhorMatch.resposta 
        : "Para dúvidas ou agendamento direto, clique no link abaixo para falar pelo WhatsApp:\n👉 https://wa.me/5519999998888";
    }

    function dispararEnvio() {
      const txt = input.value.trim();
      if (!txt) return;
      addMessage(txt, "user");
      input.value = "";
      setTimeout(() => addMessage(buscarResposta(txt), "bot"), 300);
    }

    function alternarJanela() {
      const estaFechada = chatWindow.classList.contains("faq-hidden");
      if (estaFechada) {
        chatWindow.classList.remove("faq-hidden");
        toggleBtn.innerText = "✕";
        input.focus();
      } else {
        chatWindow.classList.add("faq-hidden");
        toggleBtn.innerText = "💬";
      }
    }

    if (opcoes.jsonUrl) {
      fetch(opcoes.jsonUrl)
        .then(res => res.json())
        .then(dados => {
          baseConhecimento = dados;
          carregarMenuInicial();
        })
        .catch(err => console.error("Erro ao carregar JSON:", err));
    }

    toggleBtn.addEventListener("click", alternarJanela);
    closeBtn.addEventListener("click", alternarJanela);
    sendBtn.addEventListener("click", dispararEnvio);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") dispararEnvio();
    });
  };
})();