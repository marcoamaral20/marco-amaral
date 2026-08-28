export const WHATSAPP_NUMBER = "554298808090";

export const GENERIC_WHATSAPP_MESSAGE =
  "Olá, Marco. Gostaria de conversar sobre um projeto.";

export const DIRECT_WHATSAPP_MESSAGE =
  "Olá, Marco. Tenho um projeto ou problema que gostaria de explicar diretamente.";

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
