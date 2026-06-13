// Expose function globally to let the configurator send text to the message field
window.populateInquiryForm = function(text) {
  const messageEl = document.getElementById('message');
  if (messageEl) {
    messageEl.value = text;
    // Dispatch input event to clear validation errors
    messageEl.dispatchEvent(new Event('input', { bubbles: true }));
  }
};

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function getField(id) {
  return document.getElementById(id);
}

function setError(fieldId, message) {
  const field = getField(fieldId);
  const error = document.getElementById(`${fieldId}Error`);
  if (field) field.classList.toggle('error', Boolean(message));
  if (error) error.textContent = message || '';
}

function clearErrors() {
  ['name', 'businessName', 'spaceType', 'message'].forEach(id => setError(id, ''));
}

function validate() {
  let valid = true;

  const name = getField('name').value.trim();
  if (!name) {
    setError('name', 'Please enter your name.');
    valid = false;
  } else if (name.length < 2) {
    setError('name', 'Name must be at least 2 characters.');
    valid = false;
  }

  const business = getField('businessName').value.trim();
  if (!business) {
    setError('businessName', 'Please enter your business name.');
    valid = false;
  }

  const spaceType = getField('spaceType').value;
  if (!spaceType) {
    setError('spaceType', 'Please select your type of space.');
    valid = false;
  }

  const message = getField('message').value.trim();
  if (!message) {
    setError('message', 'Please tell us about your vision.');
    valid = false;
  } else if (message.length < 20) {
    setError('message', 'Please provide a bit more detail (at least 20 characters).');
    valid = false;
  }

  return valid;
}

async function submitToEmail(data) {
  // Use FormSubmit.co AJAX API endpoint to send submissions directly to the business email
  const response = await fetch('https://formsubmit.co/ajax/pyrovarobotics@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Submission failed');
  }
}

function setLoading(loading) {
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  submitBtn.disabled = loading;
  if (btnText) btnText.style.display = loading ? 'none' : '';
  if (btnLoading) btnLoading.style.display = loading ? '' : 'none';
}

if (form) {
  // Clear individual field errors on input
  ['name', 'businessName', 'spaceType', 'message'].forEach(id => {
    const el = getField(id);
    if (el) {
      el.addEventListener('input', () => setError(id, ''));
      el.addEventListener('change', () => setError(id, ''));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    if (!validate()) return;

    setLoading(true);

    // FormSubmit accepts standard key-value inputs and titles them in the email.
    // We name the fields cleanly for the resulting email notification.
    const payload = {
      'Name': getField('name').value.trim(),
      'Business Name': getField('businessName').value.trim(),
      'Space Type': getField('spaceType').value.toUpperCase(),
      'Message / Vision Details': getField('message').value.trim(),
      '_subject': `New Custom Bot Inquiry from ${getField('businessName').value.trim()}`,
      '_honey': '', // honeypot spam protection field
    };

    try {
      await submitToEmail(payload);
      form.reset();
      formSuccess.style.display = '';
      submitBtn.style.display = 'none';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch {
      setError('message', 'Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  });
}
