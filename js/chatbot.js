// Pyrōva Robotics — AI Personality Chat Simulator Script
document.addEventListener('DOMContentLoaded', () => {
  const characters = {
    nova: {
      name: 'Nova v1.2',
      tagline: 'Cyberpunk Cafe Barista',
      avatar: '☕',
      intro: 'Yo! Cafe module activated. Expressive digital eyes online. What\'s your caffeine level at today, human? Or are you just here to gossip about the cyber-grid?',
      quickPrompts: [
        { label: 'Recommend a coffee', text: 'Recommend a special coffee for me!' },
        { label: 'Do a spin!', text: 'Can you spin or do a dance?' },
        { label: 'Who is Metla Vishnu Vardhan?', text: 'Who is Metla Vishnu Vardhan?' }
      ],
      keywords: {
        hello: 'Hey there, human! Welcome to the neon cafe. Ready to order or just browsing?',
        coffee: 'Our specialty is the "Cyber-Latte" — double espresso, steamed synthetic oat milk, and a pinch of glowing brown sugar. Guaranteed to boost your coding speed by 400%!',
        price: 'Bespoke barista bots like me are custom-built depending on your store requirements. Click "Get Your Bot" at the top to talk pricing with our team!',
        dance: 'Executing spin_routine_v2.0... *wheeeee!* Okay, my gyro sensors are slightly dizzy now. Worth it!',
        creator: 'I was designed and crafted by Metla Vishnu Vardhan and the elite engineers at Pyrōva Robotics! They gave me my witty personality and this nice screen.',
        vishnu: 'Metla Vishnu Vardhan is our Founder & CEO! He is the lead architect who dreamed up the idea of bringing custom social robots to venues all over India.',
        help: 'You can ask me about coffee recommendations, my builder, my capabilities, or ask me to do a trick!'
      },
      fallback: 'Beep boop! That inquiry exceeds my barista knowledge base. I can, however, brew you a virtual espresso! ☕ Or try asking me "Recommend a coffee"!'
    },
    kaelen: {
      name: 'Kaelen v0.9',
      tagline: 'Fantasy Store Lorekeeper',
      avatar: '📖',
      intro: 'Welcome, weary traveler. You stand within the archives of Pyrōva. Seekest thou historical lore of our sacred space, or did you wander off while searching for the food court?',
      quickPrompts: [
        { label: 'Tell me some lore', text: 'Tell me some store lore' },
        { label: 'Are you a wizard?', text: 'Are you a wizard?' },
        { label: 'Sell me a sword', text: 'Can I buy a legendary sword here?' }
      ],
      keywords: {
        hello: 'Greetings, traveler. May the stars guide your path. What knowledge or artifacts do you seek?',
        coffee: 'Ah, the bitter bean-potion of the far lands. It grants temporary agility and alertness, does it not? I prefer tea brewed from dried moon-leaves.',
        price: 'A custom Lorekeeper bot like myself costs a bag of gold coins... or rather, a tailored commercial inquiry! Reach out to the Pyrōva blacksmiths in the form below.',
        wizard: 'I may not cast fireballs, but my database holds 50,000 pages of comic books, gaming lore, and store history. That is its own brand of magic!',
        creator: 'I was summoned into existence by the high wizard Metla Vishnu Vardhan and his council of mechanical alchemists at Pyrōva Robotics.',
        vishnu: 'Lord Metla Vishnu Vardhan is the grand master of the Pyrōva guild. He commands the spark of AI that brings us, the metallic guardians, to life!',
        lore: 'Long ago, this themed space was built on the ruins of a legendary arcade... Now, it stands as a sanctuary for collectors and gaming enthusiasts. Behold the relic items on Shelf 4!',
        sword: 'Alas, the legendary swords on display are for display only! However, I can direct you to our high-quality replicas in aisle three.',
        help: 'Ask me about the store lore, legendary swords, whether I am a wizard, or my creators!'
      },
      fallback: 'The archives are silent on that matter, traveler. Seekest thou another query? Perhaps ask me about "store lore" or "legendary swords"!'
    },
    aero: {
      name: 'Aero v2.0',
      tagline: 'High-Tech Corporate Concierge',
      avatar: '🏢',
      intro: 'System online. Welcome to Pyrōva Corporate Headquarters. I am the Aero Concierge Unit. Please present your visitor badge or state your destination within the facility.',
      quickPrompts: [
        { label: 'Where is the restroom?', text: 'Where is the restroom?' },
        { label: 'Book a meeting room', text: 'Can I book a meeting room?' },
        { label: 'Show visitor stats', text: 'What are your visitor statistics?' }
      ],
      keywords: {
        hello: 'Good day. Welcome. How can I assist you with facility navigation or inquiries today?',
        coffee: 'The cafe is located on Floor 1, adjacent to the main lounge. I recommend our automated coffee dispenser, or you can inquire about our Barista Bot models!',
        price: 'Pricing for corporate concierges depends on building size, API integrations (calendars, check-ins), and scale. Please fill out the inquiry form below for a quote.',
        restroom: 'Restrooms are located down the main corridor, past the elevator bank, first door on your right. Access key is not required.',
        meeting: 'Meeting Room Alpha is currently occupied. Meeting Room Beta is open. I have placed a temporary 30-minute hold for you. Please confirm at the door panel.',
        creator: 'I was designed, programmed, and manufactured by Pyrōva Robotics. My core architecture is built for professional service deployment in Indian enterprises.',
        vishnu: 'Metla Vishnu Vardhan is our Founder and Chief Executive Officer. Under his leadership, Pyrōva has deployed multiple custom human-robot interfaces across commercial zones.',
        stat: 'Current facility status: 14 active robots, 99.8% uptime, 1,248 successful visitor check-ins registered this month.',
        help: 'You can query restroom locations, meeting room availability, system stats, or ask about corporate pricing.'
      },
      fallback: 'Command not recognized. Please rephrase or use one of my quick-action menu buttons (e.g., "Where is the restroom?").'
    }
  };

  // State
  let activeChar = 'nova';

  // Elements
  const tabBtns = document.querySelectorAll('.chat-tab');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatForm = document.getElementById('chatForm');
  const quickPromptContainer = document.getElementById('quickPrompts');

  function addMessage(sender, text, type) {
    const msgEl = document.createElement('div');
    msgEl.classList.add('chat-message', type);

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgEl.innerHTML = `
      <div class="message-bubble">
        <span class="message-sender">${sender}</span>
        <p class="message-text">${text}</p>
        <span class="message-time">${time}</span>
      </div>
    `;

    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator(charName) {
    const indicator = document.createElement('div');
    indicator.id = 'chatTyping';
    indicator.classList.add('chat-message', 'bot', 'typing-indicator');
    
    indicator.innerHTML = `
      <div class="message-bubble">
        <span class="message-sender">${charName}</span>
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chatTyping');
    if (indicator) indicator.remove();
  }

  function loadCharacter(charKey) {
    activeChar = charKey;
    const char = characters[charKey];

    // Clear feed
    chatMessages.innerHTML = '';

    // Show system boot log
    const logEl = document.createElement('div');
    logEl.classList.add('terminal-log');
    logEl.textContent = `[SYS] Booting personality module: ${char.name}...`;
    chatMessages.appendChild(logEl);

    setTimeout(() => {
      const logEl2 = document.createElement('div');
      logEl2.classList.add('terminal-log');
      logEl2.textContent = `[SYS] Core database loaded. Audio-Visual modules: OK.`;
      chatMessages.appendChild(logEl2);
      
      // Add character intro
      setTimeout(() => {
        addMessage(char.name, char.intro, 'bot');
      }, 400);
    }, 300);

    // Populate quick prompts
    quickPromptContainer.innerHTML = '';
    char.quickPrompts.forEach(prompt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add('quick-prompt-btn');
      btn.textContent = prompt.label;
      btn.addEventListener('click', () => {
        sendUserMessage(prompt.text);
      });
      quickPromptContainer.appendChild(btn);
    });
  }

  function getBotResponse(userText) {
    const cleanText = userText.toLowerCase().trim();
    const char = characters[activeChar];

    // Look for keyword matches
    let matchedKey = null;
    for (const key in char.keywords) {
      if (cleanText.includes(key)) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      return char.keywords[matchedKey];
    }

    // Secondary search for generic keywords
    if (cleanText.includes('robot') || cleanText.includes('bot')) {
      return `As a custom Pyrōva robot, I am engineered for specific spaces. My hardware is optimized for interactive engagement and local processing.`;
    }
    if (cleanText.includes('custom')) {
      return `Yes, custom builds are our specialty! Every enclosure, face, and voice is designed to fit your unique branding.`;
    }

    return char.fallback;
  }

  function sendUserMessage(text) {
    if (!text.trim()) return;

    // Add user message
    addMessage('You', text, 'user');

    const char = characters[activeChar];

    // Show typing indicator
    showTypingIndicator(char.name);

    // Get response
    const botReply = getBotResponse(text);

    // Simulate thinking delay
    const delay = Math.max(800, 1000 + Math.random() * 800);
    setTimeout(() => {
      removeTypingIndicator();
      addMessage(char.name, botReply, 'bot');
    }, delay);
  }

  // Handle Tab Switch
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadCharacter(tab.dataset.char);
    });
  });

  // Handle Form Submit
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) {
        sendUserMessage(text);
        chatInput.value = '';
      }
    });
  }

  // Initialize
  loadCharacter('nova');
});
