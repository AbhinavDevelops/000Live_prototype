import { useMutation } from "@tanstack/react-query";
import { terminateCall } from "@/api/api.ts";

export default function useTerminateCall() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: terminateCall,
  });
  return { mutate, isPending, isError, error };
}
