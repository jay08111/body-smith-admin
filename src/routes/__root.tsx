import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProgress } from "@/components/navigation-progress";
import GeneralError from "@/features/errors/general-error";
import NotFoundError from "@/features/errors/not-found-error";
import { toast } from "sonner";
import { verifyToken } from "@/utils/utils";
import Wrapper from "@/components/wrapper";
import { __DEV__, TOKEN_STRING } from "@/config/vars";

let hasRedirected = false;
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem(TOKEN_STRING);

    const publicPaths = ["/sign-in"];
    const isPublic = publicPaths.includes(location.pathname);

    const _token = verifyToken(token);

    if (!_token && !isPublic) {
      if (hasRedirected) return;
      toast.dismiss();
      toast.error("로그인 시간이 만료되었습니다, 다시 로그인해주세요.");
      hasRedirected = true;
      localStorage.removeItem(TOKEN_STRING);

      throw redirect({ to: "/sign-in" });
    } else {
      hasRedirected = false;
    }

    if (_token && location.pathname === "/sign-in") {
      throw redirect({ to: "/" });
    }
  },
  component: () => {
    return (
      <Wrapper>
        <NavigationProgress />
        <Outlet />
        <Toaster richColors duration={5000} />

        {__DEV__ && (
          <>
            {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            {/* <TanStackRouterDevtools position="bottom-right" /> */}
          </>
        )}
      </Wrapper>
    );
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});
