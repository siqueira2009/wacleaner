    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function findScrollable() {
        const main = document.querySelector('#main');
        const mainDivs = main.querySelectorAll('div')

        const container = Array.from(mainDivs).find(div => {
            const overflowY = getComputedStyle(div).overflowY;
            return (overflowY == 'auto' || overflowY == 'scroll') && div.scrollHeight > div.clientHeight;
        });

        return container;
    }

    async function scrollUp() {
        const container = findScrollable();
        if (!container) return;

        let lastHeight = -1;
        while (container.scrollHeight != lastHeight) {
            lastHeight = container.scrollHeight;
            container.scrollTop = 0;
            await sleep(800);
        }

        return;
    }

    async function scrollDown(options) {
        await sleep(300);
        await checkThings(options);

        const container = findScrollable();
        if (!container) return;

        while (container.scrollTop + container.clientHeight < container.scrollHeight - 10) {
            container.scrollBy(0, 1000);
            await sleep(600);
            await checkThings(options);
        }
    }

    async function openSelection() {
        const menuButton = document.querySelector('#main button[aria-label="Mais opções"]');
        menuButton.click();
        await sleep(150);
        const selectButton = document.querySelector('button[aria-label="Selecionar mensagens"]');
        selectButton.click();
    }

    let selectedIds = new Set();

    async function checkThings(options) {
        if (options.includes('image')) {
            const allAlbums = document.querySelectorAll('[data-testid="image-album"]');

            if (allAlbums.length > 0) {
                for (const album of allAlbums) {
                    const input = album.querySelector('input');
    
                    input.click()
                }
            }
        }
        
        const allMessages = document.querySelectorAll('[data-testid="msg-container"]');
        if (allMessages.length > 0) {
            for (const msg of allMessages) {
                let toClickElement;

                const msgFather = msg.closest('[data-id]');
                if (!msgFather) continue;

                const msgId = msgFather.getAttribute('data-id');
        
                if (selectedIds.has(msgId) == true) continue;

                let hasId = false;

                if (options.includes('audio')) {
                    const elements = msg.querySelectorAll('[aria-label]');
                    hasId = Array.from(elements).some(el => {
                        const aria = el.getAttribute('aria-label') || "";
                        return aria.includes('Mensagem de voz');
                    });
                }

                if (!hasId) {
                    const elements = msg.querySelectorAll('[data-testid]');
                    hasId = Array.from(elements).some(el => {
                        const id = el.getAttribute('data-testid') || "";
                        return options.some(option => id !== "" && id.includes(option) && option != 'audio');
                    });
                }

                if (hasId == true) {
                    toClickElement = msg.previousElementSibling.querySelector('input');
        
                    try {
                        toClickElement.click();
                        msg.classList.add('wa-cleaner-selected');
                        selectedIds.add(msgId);
        
                        await sleep(150);
                    } catch (error) {
                        console.error("Erro ao selecionar mensagem: " + error);
                    }
                }
            }
        }

        const checksAudio = document.querySelectorAll('input[aria-label*="Duração"]');

        if (checksAudio.length > 0) {
            for (const check of checksAudio) {
                if (!check.classList.contains('wa-cleaner-selected') || check.getAttribute('aria-checked') == "false") {
                    check.click();
                    check.classList.add('wa-cleaner-selected');
                    await sleep(150);
                }
            }
        }
    }

    async function deleteImages() {
        const deleteButton = document.querySelector('button[aria-label="Apagar"]');

        if (deleteButton.getAttribute('aria-disabled') == "true") {
            console.log("No selection");

            const cancelButton = document.querySelector('button[aria-label="Cancelar seleção"]');
            cancelButton.click();
            return;
        }

        deleteButton.click();

        await sleep(150);

        const spans = document.querySelectorAll('span');
        const spanDeletion = Array.from(spans).filter(span => span.textContent == "Apagar para mim");
        const confirmDeletion = spanDeletion[0];

        if (confirmDeletion) {
            confirmDeletion.click();
        }
    }

    function injectHider() {
        const style = document.createElement('style');

        style.textContent = `
            @import url('https://fonts.cdnfonts.com/css/cabinet-grotesk');
        
            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            #whatsapp-cleaner-page-hider {
                font-family: 'Cabinet Grotesk', sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                position: absolute;
                width: 100%;
                height: 100%;
                background-color: #152e2c;
                color: white;
                z-index: 99999;

                transition: 0.3s all;
            }
            
            #whatsapp-cleaner-page-hider h1 {
                font-size: 64px;
                font-weight: 800;
                margin-bottom: 10px;
            }

            #whatsapp-cleaner-page-hider h2 {
                font-size: 32px;
                font-weight: 300;
            }

            #whatsapp-cleaner-page-hider .loader-bar {
                width: 200px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                margin-top: 20px;
                position: relative;
                overflow: hidden;
            }

            #whatsapp-cleaner-page-hider .loader-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 50%;
                background: #25d366;
                border-radius: 10px;
                animation: loading 2s infinite ease-in-out;
            }

            @keyframes loading {
                0% { left: -50%; }
                100% { left: 100%; }
            }
        `

        document.head.appendChild(style)

        const pageHider = document.createElement('div'); 

        pageHider.id = 'whatsapp-cleaner-page-hider';

        pageHider.innerHTML = `
            <h1>Limpando</h1>
            <h2>Não feche essa aba!</h2>
            <div class="loader-bar"></div>
        `;

        document.body.appendChild(pageHider);
    }

    function removeHider() {
        const hider = document.getElementById('whatsapp-cleaner-page-hider');

        hider.style.opacity = 0;

        setTimeout(() => {
            hider.remove();
        }, 350)

    }

    async function main(options, type) {
        await injectHider();

        if (type == "full") {
            console.warn("[WACleaner] Início da limpeza completa")

            await scrollUp();
            await sleep(300);
            await openSelection();
            await sleep(200);
            await scrollDown(options);
            await sleep(300);

            console.warn("[WACleaner] Fim da limpeza completa")
        } else {
            console.warn("[WACleaner] Início da limpeza parcial")
            
            await openSelection();
            await sleep(200);
            await checkThings(options);
            await sleep(300);        

            console.warn("[WACleaner] Fim da limpeza parcial")
        }
        
        await deleteImages();

        setTimeout(async () => {
            await removeHider();
        }, 500);
    }