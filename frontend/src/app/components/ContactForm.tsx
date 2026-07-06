import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";

type Lang = "RU" | "EN" | "KZ";

export type ContactFormLabels = {
  label: string;
  title: string;
  subtitle: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  telegram: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  successPendingBot: string;
  error: string;
  required: string;
  invalidEmail: string;
  telegramHint: string;
  telegramCta: string;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  telegram_username: string;
  message: string;
};

type ContactFormProps = {
  lang: Lang;
  labels: ContactFormLabels;
  botUsername: string;
};

const API_URL = import.meta.env.VITE_API_URL || "/api";

const BRAND = {
  green: "#009933",
  accentGreen: "#39AA50",
  navy: "#00336E",
  textDark: "#1B2633",
  textMuted: "#5F6B76",
  border: "#E3E9E5",
  lightBg: "#F5F8F6",
};

function Field({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: typeof User;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND.textMuted }}>
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: BRAND.green }}
        />
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs" style={{ color: "#dc2626" }}>
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm outline-none transition-all placeholder:text-[#BBCAD5] focus:border-[#009933] focus:ring-[3px] focus:ring-[#009933]/15";

export function ContactForm({ lang, labels, botUsername }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      telegram_username: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setFeedbackMessage("");

    try {
      const response = await fetch(`${API_URL}/feedback/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, lang }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(typeof data === "object" ? JSON.stringify(data) : labels.error);
      }

      if (data.telegram_confirmation === "pending_start_bot") {
        setFeedbackMessage(labels.successPendingBot.replace("@bot", `@${botUsername}`));
      } else {
        setFeedbackMessage(labels.success);
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setFeedbackMessage(labels.error);
    }
  };

  return (
    <div
      className="w-full max-w-full overflow-hidden rounded-2xl border"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, #F5F8F6 100%)",
        borderColor: "rgba(255,255,255,0.25)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
      }}
    >
      <div
        className="px-5 py-5 sm:px-8 sm:py-6"
        style={{ borderBottom: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.72)" }}
      >
        <p
          className="text-xs font-semibold uppercase mb-2"
          style={{ letterSpacing: "0.12em", color: BRAND.green }}
        >
          {labels.label}
        </p>
        <h3 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: BRAND.navy }}>
          {labels.title}
        </h3>
        <p className="text-sm leading-relaxed max-w-xl" style={{ color: BRAND.textMuted }}>
          {labels.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 sm:px-8 sm:py-7 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="name" label={labels.name} icon={User} error={errors.name?.message}>
            <input
              id="name"
              className={inputClass}
              style={{ borderColor: errors.name ? "#fca5a5" : BRAND.border, color: BRAND.textDark }}
              placeholder={labels.name}
              {...register("name", { required: labels.required })}
            />
          </Field>

          <Field id="email" label={labels.email} icon={Mail} error={errors.email?.message}>
            <input
              id="email"
              type="email"
              className={inputClass}
              style={{ borderColor: errors.email ? "#fca5a5" : BRAND.border, color: BRAND.textDark }}
              placeholder="name@company.com"
              {...register("email", {
                required: labels.required,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: labels.invalidEmail,
                },
              })}
            />
          </Field>

          <Field id="phone" label={labels.phone} icon={Phone}>
            <input
              id="phone"
              className={inputClass}
              style={{ borderColor: BRAND.border, color: BRAND.textDark }}
              placeholder="+7 707 000 0000"
              {...register("phone")}
            />
          </Field>

          <Field id="company" label={labels.company} icon={Building2}>
            <input
              id="company"
              className={inputClass}
              style={{ borderColor: BRAND.border, color: BRAND.textDark }}
              placeholder={labels.company}
              {...register("company")}
            />
          </Field>
        </div>

        <div className="space-y-2">
          <label htmlFor="telegram_username" className="block text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND.textMuted }}>
            {labels.telegram}
          </label>
          <div className="relative">
            <Send
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: BRAND.green }}
            />
            <input
              id="telegram_username"
              className={inputClass}
              style={{ borderColor: BRAND.border, color: BRAND.textDark }}
              placeholder="@username"
              {...register("telegram_username")}
            />
          </div>
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl px-4 py-3"
            style={{ background: `${BRAND.lightBg}`, border: `1px solid ${BRAND.border}` }}
          >
            <p className="text-xs leading-relaxed" style={{ color: BRAND.textMuted }}>
              {labels.telegramHint.replace("@bot", `@${botUsername}`)}
            </p>
            <a
              href={`https://t.me/${botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
              style={{ background: BRAND.navy, color: "#fff" }}
            >
              {labels.telegramCta}
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND.textMuted }}>
            {labels.message}
          </label>
          <div className="relative">
            <MessageSquare
              size={16}
              className="pointer-events-none absolute left-3.5 top-3.5"
              style={{ color: BRAND.green }}
            />
            <textarea
              id="message"
              rows={4}
              className="w-full resize-none rounded-lg border bg-white pl-10 pr-3 py-3 text-sm outline-none transition-all placeholder:text-[#BBCAD5] focus:border-[#009933] focus:ring-[3px] focus:ring-[#009933]/15"
              style={{
                borderColor: errors.message ? "#fca5a5" : BRAND.border,
                color: BRAND.textDark,
              }}
              placeholder={labels.message}
              {...register("message", { required: labels.required })}
            />
          </div>
          {errors.message && (
            <p className="flex items-center gap-1.5 text-xs" style={{ color: "#dc2626" }}>
              <AlertCircle size={12} />
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            background: `linear-gradient(135deg, ${BRAND.green} 0%, ${BRAND.accentGreen} 100%)`,
            boxShadow: "0 10px 24px rgba(0,153,51,0.28)",
          }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              {labels.sending}
            </>
          ) : (
            <>
              {labels.submit}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {feedbackMessage && (
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm leading-relaxed"
            style={{
              background: status === "error" ? "rgba(254,226,226,0.95)" : "rgba(220,252,231,0.95)",
              color: status === "error" ? "#991b1b" : "#166534",
              border: `1px solid ${status === "error" ? "#fecaca" : "#bbf7d0"}`,
            }}
          >
            {status === "error" ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={18} className="shrink-0 mt-0.5" />}
            <span>{feedbackMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}
