const DEFAULT_LOCALE = 'es-AR';

export type CurrencyFormatOptions = {
  includeSymbol?: boolean;
  currency?: string;
} & Intl.NumberFormatOptions;

export const formatCurrency = (
  value: number | string,
  options: CurrencyFormatOptions = {}
): string => {
  const numericValue =
    typeof value === 'number' ? value : Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '0';
  }

  const {
    includeSymbol = false,
    currency = 'ARS',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    ...rest
  } = options;

  const formatterOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits,
    maximumFractionDigits,
    ...rest,
  };

  if (includeSymbol) {
    formatterOptions.style = 'currency';
    formatterOptions.currency = currency;
  }

  return new Intl.NumberFormat(DEFAULT_LOCALE, formatterOptions).format(
    numericValue
  );
};

export default formatCurrency;
