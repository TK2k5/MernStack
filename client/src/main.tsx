import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistor, store } from "./stores/store.ts";

import App from "./App.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { StrictMode } from "react";
import { Toaster } from "./components/ui/sonner.tsx";
import { createRoot } from "react-dom/client";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
