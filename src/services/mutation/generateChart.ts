import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface GenerateChartRequest {
  message: string;
}

interface GenerateChartResponse {
  // Define the expected response shape here
  result: string;
}

const generateChart = async ({
  message,
}: GenerateChartRequest): Promise<GenerateChartResponse> => {
  const response = await axios.post("/api/generate-chart", {
    content: message,
  });

  if (!response) {
    throw new Error("Failed to generate chart");
  }

  return response.data;
};

export const useGenerateChartMutation = () =>
  useMutation({
    mutationFn: generateChart,
  });
