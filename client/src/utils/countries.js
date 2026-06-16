// A practical list of countries with ISO codes and postal code (ZIP) validation patterns.
// The regex is used to verify the ZIP code format matches what's expected for that country.
// Countries with no strict postal system (e.g. some African/Caribbean nations) use null —
// meaning any non-empty value is accepted.

const countries = [
  { name: 'United States',        code: 'US', zipRegex: /^\d{5}(-\d{4})?$/ },
  { name: 'United Kingdom',       code: 'GB', zipRegex: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/ },
  { name: 'Canada',               code: 'CA', zipRegex: /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/ },
  { name: 'Nigeria',               code: 'NG', zipRegex: /^\d{6}$/ },
  { name: 'Ghana',                 code: 'GH', zipRegex: null },
  { name: 'South Africa',         code: 'ZA', zipRegex: /^\d{4}$/ },
  { name: 'Kenya',                 code: 'KE', zipRegex: /^\d{5}$/ },
  { name: 'Germany',               code: 'DE', zipRegex: /^\d{5}$/ },
  { name: 'France',                code: 'FR', zipRegex: /^\d{5}$/ },
  { name: 'Spain',                 code: 'ES', zipRegex: /^\d{5}$/ },
  { name: 'Italy',                 code: 'IT', zipRegex: /^\d{5}$/ },
  { name: 'Netherlands',           code: 'NL', zipRegex: /^\d{4}\s?[A-Za-z]{2}$/ },
  { name: 'Belgium',                code: 'BE', zipRegex: /^\d{4}$/ },
  { name: 'Portugal',               code: 'PT', zipRegex: /^\d{4}-\d{3}$/ },
  { name: 'Ireland',                code: 'IE', zipRegex: null },
  { name: 'Switzerland',            code: 'CH', zipRegex: /^\d{4}$/ },
  { name: 'Austria',                code: 'AT', zipRegex: /^\d{4}$/ },
  { name: 'Sweden',                 code: 'SE', zipRegex: /^\d{3}\s?\d{2}$/ },
  { name: 'Norway',                 code: 'NO', zipRegex: /^\d{4}$/ },
  { name: 'Denmark',                code: 'DK', zipRegex: /^\d{4}$/ },
  { name: 'Poland',                 code: 'PL', zipRegex: /^\d{2}-\d{3}$/ },
  { name: 'Australia',              code: 'AU', zipRegex: /^\d{4}$/ },
  { name: 'New Zealand',            code: 'NZ', zipRegex: /^\d{4}$/ },
  { name: 'Brazil',                  code: 'BR', zipRegex: /^\d{5}-?\d{3}$/ },
  { name: 'Mexico',                  code: 'MX', zipRegex: /^\d{5}$/ },
  { name: 'India',                   code: 'IN', zipRegex: /^\d{6}$/ },
  { name: 'United Arab Emirates',   code: 'AE', zipRegex: null },
  { name: 'Saudi Arabia',           code: 'SA', zipRegex: /^\d{5}$/ },
  { name: 'Egypt',                   code: 'EG', zipRegex: /^\d{5}$/ },
  { name: 'Turkey',                  code: 'TR', zipRegex: /^\d{5}$/ },
  { name: 'China',                   code: 'CN', zipRegex: /^\d{6}$/ },
  { name: 'Japan',                   code: 'JP', zipRegex: /^\d{3}-?\d{4}$/ },
  { name: 'South Korea',            code: 'KR', zipRegex: /^\d{5}$/ },
  { name: 'Singapore',               code: 'SG', zipRegex: /^\d{6}$/ },
]

// Sort alphabetically for a nicer dropdown
countries.sort((a, b) => a.name.localeCompare(b.name))

export const getCountryByName = (name) => countries.find((c) => c.name === name)

export default countries
