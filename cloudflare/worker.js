addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const BACKEND_URL = 'http://194.60.133.152:3000'
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    let backendUrl = BACKEND_URL
    let requestBody = null
    
    if (url.pathname === '/health') {
      backendUrl = BACKEND_URL + '/health'
    } else if (url.pathname.startsWith('/api/')) {
      backendUrl = BACKEND_URL + url.pathname + url.search
      if (request.method !== 'GET') {
        requestBody = request.body
      }
    } else {
      return new Response('Not Found', { status: 404, headers: corsHeaders })
    }

    const fetchOptions = {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
    }
    
    if (requestBody) {
      fetchOptions.body = requestBody
    }

    const response = await fetch(backendUrl, fetchOptions)
    
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })
    
    Object.entries(corsHeaders).forEach(([k, v]) => newResponse.headers.set(k, v))
    
    return newResponse
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      url: url.pathname 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
}
