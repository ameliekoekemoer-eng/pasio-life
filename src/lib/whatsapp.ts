/** Pasio Life booking contact (no + prefix for wa.me links). */
export const PASIO_WHATSAPP_NUMBER = "27764088362";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${PASIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
