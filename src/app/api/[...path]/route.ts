/**
 * Proxy API interno para evitar CORS desde el navegador.
 * El frontend llama a /api/* y este handler reenvia al backend real.
 */

const BACKEND_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000'

function buildTargetUrl(pathSegments: string[], request: Request): string {
  const target = new URL(pathSegments.join('/'), `${BACKEND_BASE_URL.replace(/\/$/, '')}/`)
  const incomingUrl = new URL(request.url)

  // Conserva query params (?a=1&b=2)
  target.search = incomingUrl.search
  return target.toString()
}

async function proxyRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  const { path } = await context.params
  const targetUrl = buildTargetUrl(path, request)

  const outgoingHeaders = new Headers(request.headers)
  outgoingHeaders.delete('host')
  outgoingHeaders.delete('content-length')

  const method = request.method.toUpperCase()
  const hasBody = method !== 'GET' && method !== 'HEAD'

  const backendResponse = await fetch(targetUrl, {
    method,
    headers: outgoingHeaders,
    body: hasBody ? request.body : undefined,
    redirect: 'manual',
    duplex: hasBody ? 'half' : undefined,
  } as RequestInit & { duplex?: 'half' })

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: backendResponse.headers,
  })
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return proxyRequest(request, context)
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return proxyRequest(request, context)
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return proxyRequest(request, context)
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return proxyRequest(request, context)
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return proxyRequest(request, context)
}

export async function OPTIONS(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return proxyRequest(request, context)
}
