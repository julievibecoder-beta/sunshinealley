export const WHATSAPP_NUMBER = "919876543210";
export const PHONE_DISPLAY = "+91 98765 43210";
export const PHONE_TEL = "+919876543210";
export const EMAIL = "info@kashmircrafts.com";
export const ADDRESS = "Lal Chowk, Srinagar, Kashmir — 190001";

export function getWhatsAppLink(productName?: string, customMessage?: string) {
  const message =
    customMessage ??
    (productName
      ? `Hi! I'm interested in ${productName}. Could you please share the price and availability?`
      : `Hi! I'd like to know more about your Kashmiri handicrafts.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(price?: number) {
  if (!price) return "Price on request";
  return `₹${price.toLocaleString("en-IN")}`;
}
