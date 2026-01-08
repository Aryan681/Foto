import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark min-h-screen bg-bg text-gray-200">
        {children}
      </div>
    </QueryClientProvider>
  );
}
