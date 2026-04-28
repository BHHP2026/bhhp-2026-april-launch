exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, phone, email, message, turnstileToken } = data;

    // 1. Optional Turnstile check (only runs if TURNSTILE_SECRET_KEY is set in Netlify env)
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (secret) {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=' + encodeURIComponent(secret) + '&response=' + encodeURIComponent(turnstileToken || ''),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Security check failed. Please try again.' })
        };
      }
    }

    // 2. Reject garbled bot names (random 16+ char alphanumeric strings)
    const cleanName = (name || '').trim();
    if (!cleanName || cleanName.length < 2 || /^[A-Za-z0-9]{16,}$/.test(cleanName)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Please enter your real name.' })
      };
    }

    const response = await fetch('https://api.followupboss.com/v1/events', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('fka_00PZ9NTvZy7ZpJdv7wO4IGy0xNgXXzk9tI:').toString('base64'),
        'Content-Type': 'application/json',
        'X-System': 'bhhp website popup',
        'X-System-Key': 'fka_00PZ9NTvZy7ZpJdv7wO4IGy0xNgXXzk9tI'
      },
      body: JSON.stringify(data)
    });

    const result = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: result
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
