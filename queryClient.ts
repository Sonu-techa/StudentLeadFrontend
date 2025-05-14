import { QueryClient } from "@tanstack/react-query";

/**
 * Type for HTTP methods
 */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Query client instance
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

/**
 * Default query function for React Query
 * @param options Query options
 */
export function getQueryFn({ on401 = "throw" }: { on401?: "throw" | "returnNull" } = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;

    const response = await fetch(url);

    if (response.status === 401) {
      if (on401 === "throw") {
        throw new Error("Unauthorized");
      } else {
        return null; // Return null instead of undefined to avoid Query data cannot be undefined error
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "An error occurred");
    }

    // If the response is empty
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  };
}

/**
 * Make an API request with custom options
 * @param method HTTP method
 * @param url API endpoint URL
 * @param body Request body
 * @returns Response
 */
export async function apiRequest(method: HttpMethod, url: string, body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;

    try {
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.message || errorText;
    } catch {
      errorMessage = errorText || `HTTP error ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  return response;
}