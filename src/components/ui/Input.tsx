import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full rounded-md border border-border bg-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber ${className}`}
        {...props}
      />
    );
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`w-full rounded-md border border-border bg-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber ${className}`}
      {...props}
    />
  );
});

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-soft">
      {children}
    </label>
  );
}
