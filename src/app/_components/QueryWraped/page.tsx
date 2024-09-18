'use client';
import { store } from '@/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux';
interface QueryProps {
    children: React.ReactNode
}

const queryClient = new QueryClient()
const QueryWraped = ({children}: QueryProps) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}

export default QueryWraped