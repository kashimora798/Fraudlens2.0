"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { IconCheck, IconAlert, IconX, IconShield } from "@/components/icons";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  title?: string;
}

let notificationId = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const add = (type: Notification["type"], message: string, title?: string) => {
    const id = String(++notificationId);
    setNotifications((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
    return id;
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, add, remove };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handle = (e: CustomEvent) => {
      const n: Notification = e.detail;
      setNotifications((prev) => [...prev, { ...n, id: String(++notificationId) }]);
    };
    window.addEventListener("fraudlens:notify", handle as EventListener);
    return () => window.removeEventListener("fraudlens:notify", handle as EventListener);
  }, []);

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const icons: Record<string, ReactNode> = {
    success: <IconCheck className="h-5 w-5 text-green-400" />,
    error: <IconAlert className="h-5 w-5 text-red-400" />,
    warning: <IconShield className="h-5 w-5 text-yellow-400" />,
    info: <IconShield className="h-5 w-5 text-cyan-400" />,
  };

  const colors: Record<string, string> = {
    success: "border-green-500/40 bg-green-500/10 text-green-400",
    error: "border-red-500/40 bg-red-500/10 text-red-400",
    warning: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
    info: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`animate-slide-up flex items-start gap-3 rounded-lg border ${colors[n.type]} p-4 backdrop-blur-sm`}
        >
          <span>{icons[n.type]}</span>
          <div className="flex-1">
            {n.title && (
              <p className="font-display text-[13px] font-bold text-white">{n.title}</p>
            )}
            <p className="mt-0.5 text-[13px] text-gray-300">{n.message}</p>
          </div>
          <button
            onClick={() => remove(n.id)}
            className="text-gray-500 transition-colors hover:text-white"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
