import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/logo/$ticker')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { ticker } = params
        const stockbitUrl = `https://assets.stockbit.com/logos/companies/${ticker}.png`

        try {
          const response = await fetch(stockbitUrl)

          if (!response.ok) {
            return new Response('Logo not found', { status: 404 })
          }

          const arrayBuffer = await response.arrayBuffer()

          return new Response(arrayBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400',
            },
          })
        } catch {
          return new Response('Failed to fetch logo', { status: 500 })
        }
      },
    },
  },
})
