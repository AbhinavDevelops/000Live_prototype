import { cn } from "@/utility/utils.ts";
import HackathonWinter24 from "@/components/subcomponents/HackathonWinter24.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={cn(
          "flex flex-col justify-center items-center mx-auto w-screen h-screen transition-colors duration-500",
        )}
      >
        <HackathonWinter24 />
      </div>
    </QueryClientProvider>
  );
}
