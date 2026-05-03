export function formatPrice(amount: number): string {
  return "AED " + new Intl.NumberFormat("en-AE").format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-AE", { day: "numeric", month: "short" });
}

export function formatWhatsApp(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function whatsAppLink(number: string, message?: string): string {
  const clean = formatWhatsApp(number);
  const text = message ?? "Hi, I saw your listing on Zaylo.";
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export function generateReference(): string {
  return "ZY-" + Math.random().toString(36).toUpperCase().slice(2, 8);
}
