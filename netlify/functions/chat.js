<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xunami Campaign Builder</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;900&display=swap');

        :root {
            --bg-color: #050505;
            --card-bg: #111111;
            --card-border: rgba(255, 255, 255, 0.1);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #38bdf8;
            --accent-gradient: linear-gradient(135deg, #38bdf8, #8b5cf6);
            --warning: #fbbf24;
            --success: #34d399;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

        body {
            background-color: var(--bg-color); color: var(--text-main); line-height: 1.6;
            overflow-x: hidden; min-height: 100vh;
        }

        /* --- CINEMATIC BACKGROUND --- */
        #hero-media { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -2; opacity: 0.3; }
        .hero-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: radial-gradient(circle at center, rgba(5,5,5,0.4) 0%, rgba(5,5,5,1) 100%); z-index: -1; }

        /* --- TOP NAVIGATION BAR --- */
        .top-nav {
            position: fixed; top: 0; left: 0; width: 100%; padding: 20px 40px; display: flex;
            justify-content: space-between; align-items: center; background: rgba(5, 5, 5, 0.8);
            backdrop-filter: blur(15px); border-bottom: 1px solid var(--card-border); z-index: 100;
        }
        .nav-logo { height: 40px; cursor: pointer; transition: transform 0.2s ease, opacity 0.2s ease; }
        .nav-logo:hover { transform: scale(1.05); opacity: 0.8; }
        .nav-links { display: flex; align-items: center; gap: 30px; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-weight: 600; font-size: 1rem; transition: color 0.3s ease; }
        .nav-links a:hover { color: white; }
        .nav-btn {
            background: var(--accent-gradient); color: white; border: none; padding: 10px 24px;
            font-size: 0.95rem; font-weight: 700; border-radius: 50px; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); }

        /* --- PAGE CONTAINERS --- */
        .page-section { display: none; padding-top: 120px; min-height: 100vh; position: relative; z-index: 10; }
        .page-section.active { display: block; animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* --- HEADER TEXT --- */
        header { text-align: center; padding: 20px 20px 40px; }
        h1 { font-size: 3.5rem; font-weight: 900; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; letter-spacing: -1px; line-height: 1.1; }
        header p { color: var(--text-muted); font-size: 1.2rem; max-width: 600px; margin: 0 auto; }

        /* =========================================
           WHAT WE DO (ABOUT) PAGE STYLES
           ========================================= */
        .about-container { max-width: 1000px; margin: 0 auto 100px; padding: 0 20px; }
        .video-placeholder { width: 100%; aspect-ratio: 16 / 9; background: rgba(17, 17, 17, 0.8); backdrop-filter: blur(10px); border: 1px solid var(--card-border); border-radius: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; margin-bottom: 80px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
        .play-btn-mock { width: 80px; height: 80px; background: var(--accent-gradient); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4); }
        .play-btn-mock::after { content: ''; width: 0; height: 0; border-top: 15px solid transparent; border-bottom: 15px solid transparent; border-left: 25px solid white; margin-left: 8px; }
        .video-placeholder h3 { color: white; font-size: 1.5rem; }
        
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .about-header { text-align: center; margin-bottom: 60px; }
        .about-header h2 { font-size: 2.5rem; color: white; margin-bottom: 15px; }
        .about-header p { color: var(--text-muted); font-size: 1.1rem; max-width: 700px; margin: 0 auto; }

        .value-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 80px; }
        .value-card { background: rgba(17, 17, 17, 0.8); border: 1px solid var(--card-border); padding: 40px; border-radius: 20px; transition: transform 0.3s ease, border-color 0.3s ease; }
        .value-card:hover { transform: translateY(-5px); border-color: var(--accent); }
        .value-icon { font-size: 2.5rem; margin-bottom: 20px; display: inline-block; }
        .value-card h3 { font-size: 1.4rem; color: white; margin-bottom: 15px; }
        .value-card p { color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 0; }

        /* =========================================
           WIZARD BUILDER STYLES 
           ========================================= */
        #wizard-container { max-width: 900px; margin: 0 auto 100px; padding: 0 20px; min-height: 600px; }
        .progress-wrapper { background: rgba(255,255,255,0.1); height: 6px; border-radius: 10px; margin-bottom: 40px; overflow: hidden; }
        #progress-fill { height: 100%; width: 20%; background: var(--accent-gradient); border-radius: 10px; transition: width 0.5s cubic-bezier(0.25, 1, 0.5, 1); }

        .step-card { background: rgba(17, 17, 17, 0.85); backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid var(--card-border); box-shadow: 0 25px 50px rgba(0,0,0,0.5); padding: 40px; display: none; opacity: 0; }
        .step-card.active { display: flex; gap: 40px; align-items: center; animation: slideInRight 0.6s forwards cubic-bezier(0.16, 1, 0.3, 1); }
        .step-card.single-col { flex-direction: column; align-items: stretch; max-width: 700px; margin: 0 auto; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }

        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 10px; color: #e2e8f0; font-size: 1.1rem; }
        .form-group input[type="text"], .form-group input[type="date"] { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); padding: 18px; border-radius: 12px; color: white; font-size: 1.1rem; outline: none; transition: border-color 0.3s ease; }
        .form-group input:focus { border-color: var(--accent); }
        .form-group input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }

        .file-upload-wrapper { position: relative; margin-bottom: 15px; }
        .file-upload-input { width: 100%; position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; height: 100%; }
        .file-upload-ui { background: rgba(56, 189, 248, 0.1); border: 2px dashed var(--accent); padding: 20px; border-radius: 12px; text-align: center; color: var(--accent); font-weight: 600; transition: all 0.3s ease; }
        .file-upload-input:hover + .file-upload-ui { background: rgba(56, 189, 248, 0.2); }

        .btn-large { width: 100%; background: var(--accent-gradient); color: white; border: none; padding: 20px; font-size: 1.2rem; font-weight: 800; border-radius: 12px; cursor: pointer; transition: transform 0.2s ease; margin-top: 10px; }
        .btn-large:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4); }
        
        .media-container { flex-shrink: 0; width: 260px; aspect-ratio: 9 / 16; border-radius: 16px; overflow: hidden; border: 3px solid #334155; background-color: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .phone-media { width: 100%; height: 100%; object-fit: cover; }
        .card-content { flex-grow: 1; }

        .step-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; color: var(--accent); font-weight: 800; display: block; margin-bottom: 5px; }
        h2 { font-size: 2.2rem; margin-bottom: 15px; line-height: 1.1; }
        p { color: var(--text-muted); font-size: 1.05rem; margin-bottom: 20px; }
        
        .caption-box { background: rgba(0,0,0,0.4); border-left: 3px solid var(--accent); padding: 20px; border-radius: 0 12px 12px 0; margin: 20px 0; font-style: italic; color: #cbd5e1; font-size: 1.05rem; }
        .caption-box strong { color: var(--accent); font-style: normal; display: block; margin-bottom: 8px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        .dynamic-text { color: white; font-weight: 700; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; }

        /* =========================================
           SCRIPT LAB (CHATBOT) STYLES
           ========================================= */
        #chat-fab {
            position: fixed; bottom: 30px; right: 30px; background: var(--accent-gradient); color: white;
            border: none; padding: 15px 25px; border-radius: 50px; font-size: 1.1rem; font-weight: 800;
            cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 1000;
            transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; align-items: center; gap: 10px;
        }
        #chat-fab:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 15px 40px rgba(56, 189, 248, 0.5); }

        #chat-drawer {
            position: fixed; top: 0; right: -400px; width: 400px; height: 100vh;
            background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); border-left: 1px solid var(--card-border);
            z-index: 1001; transition: right 0.4s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: -10px 0 50px rgba(0,0,0,0.8);
            display: flex; flex-direction: column;
        }
        #chat-drawer.open { right: 0; }

        .chat-header {
            padding: 25px; border-bottom: 1px solid var(--card-border); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3);
        }
        .chat-header h3 { font-size: 1.2rem; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .close-chat { background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; transition: color 0.2s; }
        .close-chat:hover { color: white; }

        .chat-messages { flex-grow: 1; padding: 25px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        
        .msg { max-width: 85%; padding: 15px 20px; border-radius: 16px; font-size: 0.95rem; line-height: 1.5; animation: popIn 0.3s ease forwards; }
        @keyframes popIn { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        .msg-bot { background: rgba(255,255,255,0.05); color: #e2e8f0; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid var(--card-border); }
        .msg-user { background: var(--accent-gradient); color: white; align-self: flex-end; border-bottom-right-radius: 4px; box-shadow: 0 5px 15px rgba(56, 189, 248, 0.2); }
        .msg-loading { opacity: 0.7; font-style: italic; }

        .chat-input-area { padding: 20px; border-top: 1px solid var(--card-border); background: rgba(0,0,0,0.3); display: flex; gap: 10px; }
        .chat-input-area input { flex-grow: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); padding: 15px; border-radius: 50px; color: white; outline: none; transition: border-color 0.3s; }
        .chat-input-area input:focus { border-color: var(--accent); }
        .chat-send-btn { background: var(--accent); color: #0f172a; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; justify-content: center; align-items: center; transition: transform 0.2s; }
        .chat-send-btn:hover { transform: scale(1.1); }

        @media (max-width: 768px) {
            .step-card.active { flex-direction: column; text-align: left; padding: 30px; }
            .media-container { width: 100%; max-width: 260px; margin: 0 auto; }
            .top-nav { padding: 15px 20px; }
            .nav-links { gap: 15px; }
            .nav-links a { display: none; }
            #chat-drawer { width: 100vw; right: -100vw; }
        }
    </style>
</head>
<body>

    <video id="hero-media" src="https://i.imgur.com/bQb3kxE.mp4" autoplay loop muted playsinline></video>
    <div class="hero-overlay"></div>

    <nav class="top-nav">
        <img src="https://i.imgur.com/8fQzcyk.png" alt="Xunami Logo" class="nav-logo" onclick="togglePage('builder')">
        <div class="nav-links">
            <a href="#" onclick="togglePage('about')">What We Do</a>
            <button class="nav-btn" onclick="togglePage('builder')">Start Building</button>
        </div>
    </nav>

    <button id="chat-fab" onclick="toggleChat()">✨ Script Lab</button>

    <div id="chat-drawer">
        <div class="chat-header">
            <h3>✨ Xunami Creative</h3>
            <button class="close-chat" onclick="toggleChat()">✕</button>
        </div>
        <div class="chat-messages" id="chat-box">
            <div class="msg msg-bot">Hey! I'm your Xunami Creative Co-Producer. I'm here to help brainstorm concepts, refine your brand, and write scripts for your entire campaign. To get started, <strong>how would you describe your personal brand tone?</strong> (e.g., Luxury, Casual & Relatable, Data-Driven)</div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chatInput" placeholder="Type your answer here..." onkeypress="handleChatEnter(event)">
            <button class="chat-send-btn" onclick="sendChatMessage()">➤</button>
        </div>
    </div>

    <section id="about-page" class="page-section">
        <div class="about-container">
            <div class="about-header reveal">
                <h1>More Than Just Video.</h1>
                <p>We build comprehensive, automated pre-listing hype ecosystems tailored entirely to your brand.</p>
            </div>
            <div class="video-placeholder reveal">
                <div class="play-btn-mock"></div>
                <h3>Explainer Video Coming Soon</h3>
            </div>
            <div class="about-header reveal">
                <h2>The 4-Step Ecosystem</h2>
            </div>
            <div class="value-grid">
                <div class="value-card reveal">
                    <span class="value-icon">📱</span>
                    <h3>Stop The Scroll</h3>
                    <p>High-end motion graphics and AI-driven lifestyle B-roll.</p>
                </div>
                <div class="value-card reveal">
                    <span class="value-icon">🎬</span>
                    <h3>Authentic Connection</h3>
                    <p>"Director's Guide" for raw BTS smartphone footage.</p>
                </div>
                <div class="value-card reveal">
                    <span class="value-icon">✨</span>
                    <h3>The Grand Reveal</h3>
                    <p>High-energy, cinematic property tours delivered fast.</p>
                </div>
                <div class="value-card reveal">
                    <span class="value-icon">📅</span>
                    <h3>Strategic Consistency</h3>
                    <p>Custom posting calendar synced directly to your phone.</p>
                </div>
            </div>
            <div class="about-header reveal" style="margin-bottom: 0;">
                <button class="btn-large" style="max-width: 400px; margin: 0 auto;" onclick="togglePage('builder')">Start Building Your Campaign</button>
            </div>
        </div>
    </section>

    <section id="builder-page" class="page-section active">
        <header>
            <h1>Campaign Builder</h1>
            <p>Let's co-produce your next listing's hype cycle.</p>
        </header>

        <div id="wizard-container">
            <div class="progress-wrapper">
                <div id="progress-fill"></div>
            </div>

            <div class="step-card active single-col" id="step1">
                <span class="step-label">Step 1 of 5</span>
                <h2>The Project Specs</h2>
                <div class="form-group">
                    <label>Target MLS Launch Date</label>
                    <input type="date" id="launchDate" required>
                </div>
                <div class="form-group">
                    <label>Neighborhood / Area</label>
                    <input type="text" id="location" placeholder="e.g., South Tempe, Arcadia" required>
                </div>
                <div class="form-group">
                    <label>Property Vibe</label>
                    <input type="text" id="vibe" placeholder="e.g., Desert Modern, Luxury" required>
                </div>
                <button class="btn-large" onclick="goToStep(2)">Continue to Step 2</button>
            </div>

            <div class="step-card" id="step2">
                <div class="media-container"><video src="https://i.imgur.com/tr6kBgX.mp4" class="phone-media" autoplay loop muted playsinline></video></div>
                <div class="card-content">
                    <span class="step-label">Step 2 of 5</span>
                    <h2>The Blind Tease</h2>
                    <div class="caption-box">
                        <strong>Generated Caption:</strong>
                        "Something incredible is coming to <span class="dynamic-text cap-loc">...</span> 👀 Drop a 🔑 in the comments for this <span class="dynamic-text cap-vibe">...</span> stunner."
                    </div>
                    <button class="btn-large" onclick="goToStep(3)">Looks Great, Next Step</button>
                </div>
            </div>

            <div class="step-card" id="step3">
                <div class="media-container"><img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop" class="phone-media"></div>
                <div class="card-content">
                    <span class="step-label">Step 3 of 5</span>
                    <h2>The Neighborhood Vibe</h2>
                    <div class="file-upload-wrapper">
                        <input type="file" class="file-upload-input" accept="image/*">
                        <div class="file-upload-ui">📸 Tap to Upload Custom Photo (Optional)</div>
                    </div>
                    <button class="btn-large" onclick="goToStep(4)">Upload & Continue</button>
                    <button class="btn-secondary" onclick="goToStep(4)">Skip — Let AI Handle It</button>
                </div>
            </div>

            <div class="step-card" id="step4">
                <div class="media-container"><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" class="phone-media"></div>
                <div class="card-content">
                    <span class="step-label">Step 4 of 5</span>
                    <h2>Your Smartphone BTS</h2>
                    <p>Need help knowing what to say? Click the <strong>Script Lab</strong> button in the bottom right corner!</p>
                    <div class="file-upload-wrapper">
                        <input type="file" class="file-upload-input" accept="video/*" capture="environment">
                        <div class="file-upload-ui">🎥 Record or Upload Your Video Now</div>
                    </div>
                    <button class="btn-large" onclick="goToStep(5)">Submit BTS Footage</button>
                </div>
            </div>

            <div class="step-card" id="step5">
                <div class="media-container"><video src="https://www.w3schools.com/html/mov_bbb.mp4" class="phone-media" autoplay loop muted playsinline></video></div>
                <div class="card-content">
                    <span class="step-label">Step 5 of 5</span>
                    <h2>The Reveal Tour</h2>
                    <div class="form-group">
                        <label>Professional Media Link</label>
                        <input type="text" placeholder="Paste your Dropbox or Google Drive link here...">
                    </div>
                    <button class="btn-large" onclick="goToStep(6)">Lock It In & Start Production</button>
                </div>
            </div>

            <div class="step-card single-col" id="step6" style="text-align: center;">
                <span class="step-label" style="color: var(--success); font-size: 3rem;">🎉</span>
                <h2>Production Has Started!</h2>
                <button class="btn-large" onclick="downloadCalendar()" style="background: var(--success); max-width: 400px; margin: 30px auto;">📅 Add to My Calendar</button>
            </div>
        </div>
    </section>

    <script>
        // --- PAGE TOGGLE LOGIC ---
        function togglePage(pageId) {
            document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
            document.getElementById(`${pageId}-page`).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if(pageId === 'about') checkReveals();
        }

        function checkReveals() {
            const reveals = document.querySelectorAll('.reveal');
            const windowHeight = window.innerHeight;
            reveals.forEach(reveal => {
                if(reveal.getBoundingClientRect().top < windowHeight - 100) reveal.classList.add('active');
            });
        }
        window.addEventListener('scroll', checkReveals);


        // --- WIZARD LOGIC ---
        let currentStep = 1;
        const totalSteps = 6;

        document.addEventListener("DOMContentLoaded", () => {
            if (localStorage.getItem("camp_date")) document.getElementById("launchDate").value = localStorage.getItem("camp_date");
            if (localStorage.getItem("camp_loc")) document.getElementById("location").value = localStorage.getItem("camp_loc");
            if (localStorage.getItem("camp_vibe")) document.getElementById("vibe").value = localStorage.getItem("camp_vibe");
        });

        function goToStep(nextStepIndex) {
            if (currentStep === 1) {
                const dateVal = document.getElementById('launchDate').value;
                const locVal = document.getElementById('location').value;
                const vibeVal = document.getElementById('vibe').value;
                if (!dateVal || !locVal) return alert("Please fill in the Launch Date and Location to continue!");
                localStorage.setItem("camp_date", dateVal);
                localStorage.setItem("camp_loc", locVal);
                localStorage.setItem("camp_vibe", vibeVal);
                updateDynamicText();
            }

            const currentCard = document.getElementById(`step${currentStep}`);
            currentCard.style.display = 'none';
            currentCard.classList.remove('active');

            currentStep = nextStepIndex;
            const nextCard = document.getElementById(`step${currentStep}`);
            nextCard.style.display = 'flex'; 
            requestAnimationFrame(() => nextCard.classList.add('active'));

            document.getElementById('progress-fill').style.width = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;
            document.getElementById('wizard-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function updateDynamicText() {
            const locInput = document.getElementById('location').value || "your neighborhood";
            const vibeInput = document.getElementById('vibe').value || "luxury";
            document.querySelectorAll('.cap-loc').forEach(el => el.innerText = locInput);
            document.querySelectorAll('.cap-vibe').forEach(el => el.innerText = vibeInput);
        }

        // --- CALENDAR LOGIC ---
        function downloadCalendar() {
            const dateInput = document.getElementById('launchDate').value;
            const locInput = document.getElementById('location').value;
            if(!dateInput) return alert("Launch date missing.");

            const launchDate = new Date(dateInput + 'T12:00:00');
            const post1 = new Date(launchDate); post1.setDate(launchDate.getDate() - 7);
            const formatICSDate = (date) => date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + "T090000"; 

            let icsData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Xunami Campaign Builder//EN\n";
            icsData += "BEGIN:VEVENT\nDTSTART:" + formatICSDate(post1) + "\nSUMMARY:📱 Post Video 1 (Tease): " + locInput + "\nDESCRIPTION:Time to drop the blind tease!\nEND:VEVENT\n";
            icsData += "END:VCALENDAR";

            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Xunami_Rollout_${locInput.replace(/\s+/g, '_')}.ics`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // --- REAL AI CHATBOT LOGIC ---
        let chatHistory = []; 

        function toggleChat() {
            document.getElementById('chat-drawer').classList.toggle('open');
        }

        function handleChatEnter(e) {
            if (e.key === 'Enter') sendChatMessage();
        }

        async function sendChatMessage() {
            const inputField = document.getElementById('chatInput');
            const text = inputField.value.trim();
            if (!text) return;

            // 1. Show User Message
            appendMessage(text, 'user');
            inputField.value = '';

            // 2. Show "Thinking" animation
            const loadingId = 'loading-' + Date.now();
            appendMessage("Thinking...", 'bot msg-loading', loadingId);

            try {
                // 3. Call your Netlify Bouncer
                const response = await fetch('/.netlify/functions/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, history: chatHistory })
                });
                
                const data = await response.json();
                
                // Remove "Thinking..."
                const loadingElement = document.getElementById(loadingId);
                if (loadingElement) loadingElement.remove();

                // 4. Show AI Response and save memory
                if (data.reply) {
                    const formattedReply = data.reply.replace(/\n/g, '<br>');
                    appendMessage(formattedReply, 'bot');
                    
                    chatHistory.push({ role: "user", parts: [{ text: text }] });
                    chatHistory.push({ role: "model", parts: [{ text: data.reply }] });
                } else {
                    appendMessage("Oops, I had a glitch. Try again!", 'bot');
                }
            } catch (error) {
                const loadingElement = document.getElementById(loadingId);
                if (loadingElement) loadingElement.remove();
                appendMessage("Connection error. Make sure your backend is running on Netlify!", 'bot');
            }
        }

        function appendMessage(htmlText, sender, id = null) {
            const chatBox = document.getElementById('chat-box');
            const msgDiv = document.createElement('div');
            // Adding a space before sender class in case we pass 'bot msg-loading'
            msgDiv.className = `msg msg-${sender}`.replace('msg-bot msg-loading', 'msg-bot msg-loading'); 
            
            if (id) msgDiv.id = id;
            msgDiv.innerHTML = htmlText;
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    </script>
</body>
</html>
