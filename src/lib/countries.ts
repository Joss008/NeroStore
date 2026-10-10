export interface CountryCode {
  code: string;
  dial: string;
  flag: string;
  label: string;
  currency: "PEN" | "MXN" | "COP" | "USD" | "BRL" | "ARS" | "CLP" | "EUR";
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "PE", dial: "+51", flag: "🇵🇪", label: "Perú", currency: "PEN" },
  { code: "MX", dial: "+52", flag: "🇲🇽", label: "México", currency: "MXN" },
  { code: "CO", dial: "+57", flag: "🇨🇴", label: "Colombia", currency: "COP" },
  { code: "AR", dial: "+54", flag: "🇦🇷", label: "Argentina", currency: "ARS" },
  { code: "CL", dial: "+56", flag: "🇨🇱", label: "Chile", currency: "CLP" },
  { code: "EC", dial: "+593", flag: "🇪🇨", label: "Ecuador", currency: "USD" },
  { code: "VE", dial: "+58", flag: "🇻🇪", label: "Venezuela", currency: "USD" },
  { code: "BO", dial: "+591", flag: "🇧🇴", label: "Bolivia", currency: "USD" },
  { code: "BR", dial: "+55", flag: "🇧🇷", label: "Brasil", currency: "BRL" },
  { code: "UY", dial: "+598", flag: "🇺🇾", label: "Uruguay", currency: "USD" },
  { code: "PY", dial: "+595", flag: "🇵🇾", label: "Paraguay", currency: "USD" },
  { code: "CR", dial: "+506", flag: "🇨🇷", label: "Costa Rica", currency: "USD" },
  { code: "PA", dial: "+507", flag: "🇵🇦", label: "Panamá", currency: "USD" },
  { code: "DO", dial: "+1", flag: "🇩🇴", label: "Rep. Dominicana", currency: "USD" },
  { code: "US", dial: "+1", flag: "🇺🇸", label: "Estados Unidos", currency: "USD" },
];

export function getCountryByDial(dial: string): CountryCode | undefined {
  return COUNTRY_CODES.find((c) => c.dial === dial);
}