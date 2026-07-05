import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

type Lang = "RU" | "EN" | "KZ";

export type ContactFormLabels = {
  title: string;
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
    <div>
      <h5
        className="text-xs font-semibold uppercase mb-5"
        style={{ letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}
      >
        {labels.title}
      </h5>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs text-white/70">
            {labels.name}
          </Label>
          <Input
            id="name"
            className="bg-white/10 border-white/15 text-white placeholder:text-white/40"
            {...register("name", { required: labels.required })}
          />
          {errors.name && <p className="text-xs text-red-300">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-white/70">
            {labels.email}
          </Label>
          <Input
            id="email"
            type="email"
            className="bg-white/10 border-white/15 text-white placeholder:text-white/40"
            {...register("email", {
              required: labels.required,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: labels.invalidEmail,
              },
            })}
          />
          {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs text-white/70">
            {labels.phone}
          </Label>
          <Input
            id="phone"
            className="bg-white/10 border-white/15 text-white placeholder:text-white/40"
            {...register("phone")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-xs text-white/70">
            {labels.company}
          </Label>
          <Input
            id="company"
            className="bg-white/10 border-white/15 text-white placeholder:text-white/40"
            {...register("company")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telegram_username" className="text-xs text-white/70">
            {labels.telegram}
          </Label>
          <Input
            id="telegram_username"
            className="bg-white/10 border-white/15 text-white placeholder:text-white/40"
            placeholder="@username"
            {...register("telegram_username")}
          />
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            {labels.telegramHint.replace("@bot", `@${botUsername}`)}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-xs text-white/70">
            {labels.message}
          </Label>
          <Textarea
            id="message"
            rows={4}
            className="bg-white/10 border-white/15 text-white placeholder:text-white/40 resize-none"
            {...register("message", { required: labels.required })}
          />
          {errors.message && <p className="text-xs text-red-300">{errors.message.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-11 font-semibold"
          style={{ background: "#009933", color: "#fff" }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              {labels.sending}
            </>
          ) : (
            labels.submit
          )}
        </Button>

        {feedbackMessage && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: status === "error" ? "#fca5a5" : "#86efac" }}
          >
            {feedbackMessage}
          </p>
        )}
      </form>
    </div>
  );
}
