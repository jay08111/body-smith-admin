import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { AxiosError } from "axios";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { handleServerError } from "@/utils/handle-server-error";
import { FontProvider } from "@/context/font-context";
import { ThemeProvider } from "@/context/theme-context";
import "@/index.css";
// Generated Routes
import { routeTree } from "@/routeTree.gen";
import { ZodIssueOptionalMessage, setErrorMap } from "zod";

setErrorMap((issue: ZodIssueOptionalMessage, ctx) => {
  switch (issue.code) {
    case "invalid_type":
      return { message: "잘못된 타입입니다." };
    case "too_small":
      return { message: "값이 너무 짧습니다." };
    case "invalid_string":
      if (issue.validation === "email") {
        if (ctx.data === "") return { message: "이메일을 입력해주세요" };
        return { message: "유효한 이메일을 입력해주세요" };
      }
      return { message: "잘못된 문자입니다." };
    default:
      return { message: ctx.defaultError };
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        );
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error("Content not modified!");
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {},
  }),
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <FontProvider>
            <RouterProvider router={router} />
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
