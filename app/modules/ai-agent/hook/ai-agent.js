import { useQuery } from "@tanstack/react-query";

export const useAIModels = () => {
  return useQuery({
    queryKey: ["ai-models"],
    queryFn: async () => {
      const res = await fetch("/api/ai/get-models");
      if (!res.ok) throw new Error(`Failed to fetch models: ${res.status}`);
      const data = await res.json();
      console.log("data", data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // models list rarely changes, cache for 5 min
  });
};
