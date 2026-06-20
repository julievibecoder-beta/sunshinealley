import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFloating() {
  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-warm transition-transform hover:scale-110"
      style={{ background: "var(--whatsapp)" }}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export function WhatsAppCTA({
  productName,
  className = "",
  children,
  size = "md",
}: {
  productName?: string;
  className?: string;
  children?: React.ReactNode;
  size?: "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "px-6 py-3.5 text-base" : "px-4 py-2.5 text-sm";
  return (
    <a
      href={getWhatsAppLink(productName)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium text-white transition-opacity hover:opacity-90 ${sizeClass} ${className}`}
      style={{ background: "var(--whatsapp)" }}
    >
      <MessageCircle className="h-4 w-4" />
      {children ?? "Enquire on WhatsApp"}
    </a>
  );
}
