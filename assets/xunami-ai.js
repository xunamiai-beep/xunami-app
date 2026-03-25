document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Styling Engine
    const style = document.createElement('style');
    style.innerHTML = `
        #xunami-ai-widget {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        #xunami-ai-button {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: linear-gradient(135deg, #38bdf8, #8b5cf6);
            border: none;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        #xunami-ai-button:hover {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(56, 189, 248, 0.4);
        }
        #xunami-ai-window {
            width: 380px;
            height: 520px;
            background: rgba(11, 15, 25, 0.95);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 24px;
            margin-bottom: 20px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6);
            transform-origin: bottom right;
            animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes popUp {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        #xunami-ai-header {
            padding: 20px 25px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0,0,0,0.3);
        }
        #xunami-ai-header h3 {
            margin: 0;
            color: #fff;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 700;
        }
        #xunami-ai-header h3 span {
            width: 8px;
            height: 8px;
            background: #34d399;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 12px #34d399;
            animation: pulseActive 2s infinite;
        }
        @keyframes pulseActive {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; box-shadow: 0 0 20px #34d399; }
        }
        #xunami-ai-close {
            background: none;
            border: none;
            color: #94A3B8;
            cursor: pointer;
            font-size: 1.4rem;
            transition: color 0.2s;
        }
        #xunami-ai-close:hover { color: #fff; }
        #xunami-ai-messages {
            flex: 1;
            padding: 25px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .ai-message {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 14px 18px;
            border-radius: 4px 20px 20px 20px;
            color: #F8FAFC;
            font-size: 0.95rem;
            align-self: flex-start;
            max-width: 85%;
            line-height: 1.6;
        }
        .user-message {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.15));
            border: 1px solid rgba(56, 189, 248, 0.3);
            padding: 14px 18px;
            border-radius: 20px 20px 4px 20px;
            color: #F8FAFC;
            font-size: 0.95rem;
            align-self: flex-end;
            max-width: 85%;
        }
        #xunami-ai-input-area {
            padding: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            gap: 10px;
            background: rgba(0,0,0,0.3);
        }
        #xunami-ai-input {
            flex: 1;
            background: rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            padding: 14px 18px;
            border-radius: 30px;
            outline: none;
            font-size: 0.95rem;
            transition: border-color 0.3s;
        }
        #xunami-ai-input:focus {
            border-color: #38bdf8;
        }
        #xunami-ai-send {
            background: linear-gradient(135deg, #38bdf8, #8b5cf6);
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.2s;
        }
        #xunami-ai-send:hover {
            transform: scale(1.05);
        }
        #xunami-ai-send svg { width: 22px; height: 22px; fill: white; margin-left: 2px; }
    `;
    document.head.appendChild(style);

    // 2. Inject Widget HTML
    const widget = document.createElement('div');
    widget.id = 'xunami-ai-widget';
    widget.innerHTML = `
        <div id="xunami-ai-window">
            <div id="xunami-ai-header">
                <h3><span></span> AI Co-Producer</h3>
                <button id="xunami-ai-close">✕</button>
            </div>
            <div id="xunami-ai-messages">
                <div class="ai-message">Hello! I'm your AI Co-Producer. How can we strategically scale your content today?</div>
            </div>
            <div id="xunami-ai-input-area">
                <input type="text" id="xunami-ai-input" placeholder="Ask me anything..." onkeypress="if(event.key === 'Enter') window.sendXunamiMessage()">
                <button id="xunami-ai-send" onclick="window.sendXunamiMessage()">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                </button>
            </div>
        </div>
        <button id="xunami-ai-button">✨</button>
    `;
    document.body.appendChild(widget);

    // 3. UI Logic Triggers
    const btn = document.getElementById('xunami-ai-button');
    const win = document.getElementById('xunami-ai-window');
    const closeBtn = document.getElementById('xunami-ai-close');

    btn.addEventListener('click', () => {
        win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
        if(win.style.display === 'flex') document.getElementById('xunami-ai-input').focus();
    });
    closeBtn.addEventListener('click', () => {
        win.style.display = 'none';
    });
});

window.sendXunamiMessage = async function() {
    const input = document.getElementById('xunami-ai-input');
    const messages = document.getElementById('xunami-ai-messages');
    const text = input.value.trim();
    if(!text) return;

    // Send User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.textContent = text;
    messages.appendChild(userMsg);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Loading State
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'ai-message';
    loadingMsg.textContent = 'Thinking...';
    loadingMsg.style.opacity = '0.5';
    messages.appendChild(loadingMsg);
    messages.scrollTop = messages.scrollHeight;

    try {
        const res = await fetch('/.netlify/functions/gemini-chat', {
            method: 'POST',
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        
        messages.removeChild(loadingMsg);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message';
        aiMsg.innerHTML = data.reply ? data.reply.replace(/\n/g, '<br>') : (data.error || 'Connection error.');
        messages.appendChild(aiMsg);
    } catch(err) {
        messages.removeChild(loadingMsg);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message';
        aiMsg.textContent = 'Engine offline. Could not connect to the proxy.';
        messages.appendChild(aiMsg);
    }
    messages.scrollTop = messages.scrollHeight;
}
