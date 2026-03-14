
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureStorageBucketsExist } from './config/storage.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create required storage buckets on app start
ensureStorageBucketsExist().catch(console.error);

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
