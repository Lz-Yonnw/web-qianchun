"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

export function AuthFailureGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authFailed, setAuthFailed] = useState(false);
  const redirectTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (redirectTimer.current !== null) window.clearTimeout(redirectTimer.current);
  }, []);

  function interceptUnavailableAction(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    const action = event.target.closest<HTMLElement>("[data-auth-required]");
    if (!action || action.getAttribute("aria-disabled") === "true" || action.hasAttribute("disabled")) return;

    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    if (redirectTimer.current !== null) return;

    setAuthFailed(true);
    redirectTimer.current = window.setTimeout(() => {
      router.push("/login?authError=1");
    }, 1500);
  }

  return (
    <div className="contents" onClickCapture={interceptUnavailableAction}>
      {children}
      {authFailed && (
        <div className="fixed inset-0 z-[9999] bg-white" aria-busy="true">
          <div role="alert" aria-live="assertive" className="absolute left-1/2 top-10 flex h-12 min-w-[160px] -translate-x-1/2 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm text-[#323335] shadow-[0_8px_28px_rgba(29,33,41,0.16)]">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#f53f3f] text-[10px] font-bold leading-none text-white">×</span>
            用户鉴权失败
          </div>
        </div>
      )}
    </div>
  );
}
