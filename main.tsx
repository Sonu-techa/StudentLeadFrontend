import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import SimpleApp from "./SimpleApp";
import "./index.css";

// Create the root element
const root = createRoot(document.getElementById("root")!);

// Render the simplified app
// We're using SimpleApp to avoid auth provider issues
root.render(
  <QueryClientProvider client={queryClient}>
    <SimpleApp />
  </QueryClientProvider>
);
