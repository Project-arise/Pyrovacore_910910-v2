const SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

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

async function submitToSupabase(data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
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

    const payload = {
      name: getField('name').value.trim(),
      business_name: getField('businessName').value.trim(),
      space_type: getField('spaceType').value,
      message: getField('message').value.trim(),
    };

    try {
      await submitToSupabase(payload);
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
