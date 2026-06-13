// Pyrōva Robotics — Configurator Script
document.addEventListener('DOMContentLoaded', () => {
  const models = {
    barista: { name: 'Cafe Barista Bot', icon: '☕', iq: 3, exp: 2, mob: 3, pay: 4, complexity: 3, weeks: 6 },
    guide: { name: 'Store Lore Guide Bot', icon: '📖', iq: 4, exp: 4, mob: 2, pay: 1, complexity: 2, weeks: 5 },
    host: { name: 'Host Concierge Bot', icon: '🏢', iq: 4, exp: 3, mob: 1, pay: 1, complexity: 2, weeks: 4 }
  };

  const personalities = {
    cute: { name: 'Cute & Polite', iq: 0, exp: 1, weeks: 0 },
    cyberpunk: { name: 'Cyberpunk/Gamer', iq: 1, exp: 1, weeks: 1 },
    professional: { name: 'Sleek Professional', iq: 1, exp: 0, weeks: 0 }
  };

  const abilities = {
    navigation: { name: 'Autonomous Navigation', iq: 0, exp: 0, mob: 2, pay: 0, complexity: 1, weeks: 2 },
    face: { name: 'Expressive Face Screen', iq: 0, exp: 2, mob: 0, pay: 0, complexity: 1, weeks: 1 },
    voice: { name: 'Voice Conversation', iq: 2, exp: 1, mob: 0, pay: 0, complexity: 1, weeks: 1 },
    delivery: { name: 'Delivery Tray / Arms', iq: 0, exp: 0, mob: 0, pay: 3, complexity: 1, weeks: 1 }
  };

  // State
  let currentModel = 'barista';
  let currentPersonality = 'cute';
  const currentAbilities = new Set();

  // Elements
  const modelBtns = document.querySelectorAll('#modelOpts .opt-btn');
  const personalityBtns = document.querySelectorAll('#personalityOpts .opt-btn');
  const abilityCards = document.querySelectorAll('#abilityOpts .ability-card');
  const btnConfigSubmit = document.getElementById('btnConfigSubmit');
  const configToast = document.getElementById('configToast');

  // Preview elements
  const hologramIcon = document.getElementById('hologramIcon');
  const previewName = document.getElementById('previewName');
  const statIq = document.getElementById('stat-iq');
  const statExp = document.getElementById('stat-exp');
  const statMob = document.getElementById('stat-mob');
  const statPay = document.getElementById('stat-pay');
  const barIq = document.getElementById('bar-iq');
  const barExp = document.getElementById('bar-exp');
  const barMob = document.getElementById('bar-mob');
  const barPay = document.getElementById('bar-pay');
  const estTime = document.getElementById('est-time');
  const estComplexity = document.getElementById('est-complexity');

  function updateConfigurator() {
    const modelData = models[currentModel];
    const persData = personalities[currentPersonality];

    // Compute ratings (cap at 5)
    let totalIq = modelData.iq + persData.iq;
    let totalExp = modelData.exp + persData.exp;
    let totalMob = modelData.mob;
    let totalPay = modelData.pay;
    let totalComplexity = modelData.complexity;
    let totalWeeks = modelData.weeks + persData.weeks;

    currentAbilities.forEach(abilityKey => {
      const abData = abilities[abilityKey];
      totalIq += abData.iq;
      totalExp += abData.exp;
      totalMob += abData.mob;
      totalPay += abData.pay;
      totalComplexity += abData.complexity;
      totalWeeks += abData.weeks;
    });

    totalIq = Math.min(totalIq, 5);
    totalExp = Math.min(totalExp, 5);
    totalMob = Math.min(totalMob, 5);
    totalPay = Math.min(totalPay, 5);

    // Update UI Stats
    statIq.textContent = `${totalIq}/5`;
    statExp.textContent = `${totalExp}/5`;
    statMob.textContent = `${totalMob}/5`;
    statPay.textContent = `${totalPay}/5`;

    barIq.style.width = `${totalIq * 20}%`;
    barExp.style.width = `${totalExp * 20}%`;
    barMob.style.width = `${totalMob * 20}%`;
    barPay.style.width = `${totalPay * 20}%`;

    // Update hologram and title
    hologramIcon.textContent = modelData.icon;
    previewName.textContent = modelData.name;

    // Update estimates
    estTime.textContent = `${totalWeeks} Weeks`;

    // Complexity rating
    let complexityLabel = 'Standard';
    estComplexity.className = 'est-value badge'; // Reset classes
    if (totalComplexity <= 2) {
      complexityLabel = 'Simple Build';
      estComplexity.classList.add('badge-simple');
    } else if (totalComplexity === 3) {
      complexityLabel = 'Standard';
      estComplexity.classList.add('badge-standard');
    } else if (totalComplexity === 4) {
      complexityLabel = 'Advanced';
      estComplexity.classList.add('badge-advanced');
    } else if (totalComplexity === 5) {
      complexityLabel = 'High Complexity';
      estComplexity.classList.add('badge-high');
    } else {
      complexityLabel = 'Extreme Custom';
      estComplexity.classList.add('badge-extreme');
    }
    estComplexity.textContent = complexityLabel;
  }

  // Model Selection
  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentModel = btn.dataset.model;
      updateConfigurator();
    });
  });

  // Personality Selection
  personalityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      personalityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPersonality = btn.dataset.personality;
      updateConfigurator();
    });
  });

  // Abilities Multi-selection
  abilityCards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    const abilityKey = card.dataset.ability;

    card.addEventListener('click', (e) => {
      // Prevent double toggle if clicking label/checkbox directly
      if (e.target !== checkbox && e.target.tagName !== 'LABEL' && e.target.tagName !== 'SPAN') {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        card.classList.add('selected');
        currentAbilities.add(abilityKey);
      } else {
        card.classList.remove('selected');
        currentAbilities.delete(abilityKey);
      }
      updateConfigurator();
    });
  });

  // Export to Form
  if (btnConfigSubmit) {
    btnConfigSubmit.addEventListener('click', () => {
      const selectedModelName = models[currentModel].name;
      const selectedPersName = personalities[currentPersonality].name;
      const selectedAbilities = [];
      currentAbilities.forEach(key => {
        selectedAbilities.push(abilities[key].name);
      });

      const abilitiesStr = selectedAbilities.length > 0 
        ? selectedAbilities.join(', ') 
        : 'No extra abilities selected (Base build)';

      const messageText = `Hi Pyrōva Team! I want to inquire about a custom robot. I configured a bot using your website customizer:
- Role/Model: ${selectedModelName}
- Personality Type: ${selectedPersName}
- Selected Capabilities: ${abilitiesStr}
- Estimated Timeline: ${estTime.textContent}
- Estimated Build Complexity: ${estComplexity.textContent}

Let's discuss how we can build this for my business!`;

      // Call the global helper function exposed in form.js
      if (typeof window.populateInquiryForm === 'function') {
        window.populateInquiryForm(messageText);

        // Show toast
        configToast.classList.add('show');
        setTimeout(() => {
          configToast.classList.remove('show');
        }, 4000);

        // Smooth scroll to form section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Initialize
  updateConfigurator();
});
