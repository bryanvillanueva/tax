export const taxBrackets = {
  Single: [
    { rate: 0.10, start: 0, end: 11000 },
    { rate: 0.12, start: 11001, end: 44725 },
    { rate: 0.22, start: 44726, end: 95375 },
    { rate: 0.24, start: 95376, end: 182100 },
    { rate: 0.32, start: 182101, end: 231250 },
    { rate: 0.35, start: 231251, end: 578125 },
    { rate: 0.37, start: 578126, end: Infinity },
  ],
  MFJ: [
    { rate: 0.10, start: 0, end: 22000 },
    { rate: 0.12, start: 22001, end: 89450 },
    { rate: 0.22, start: 89451, end: 190750 },
    { rate: 0.24, start: 190751, end: 364200 },
    { rate: 0.32, start: 364201, end: 462500 },
    { rate: 0.35, start: 462501, end: 693750 },
    { rate: 0.37, start: 693751, end: Infinity },
  ],
  MFS: [
    { rate: 0.10, start: 0, end: 11000 },
    { rate: 0.12, start: 11001, end: 44725 },
    { rate: 0.22, start: 44726, end: 95375 },
    { rate: 0.24, start: 95376, end: 182100 },
    { rate: 0.32, start: 182101, end: 231250 },
    { rate: 0.35, start: 231251, end: 346875 },
    { rate: 0.37, start: 346876, end: Infinity },
  ],
  HH: [
    { rate: 0.10, start: 0, end: 15700 },
    { rate: 0.12, start: 15701, end: 59850 },
    { rate: 0.22, start: 59851, end: 95350 },
    { rate: 0.24, start: 95351, end: 182100 },
    { rate: 0.32, start: 182101, end: 231250 },
    { rate: 0.35, start: 231251, end: 578100 },
    { rate: 0.37, start: 578101, end: Infinity },
  ],
  QSS: [
    { rate: 0.10, start: 0, end: 15700 },
    { rate: 0.12, start: 15701, end: 59850 },
    { rate: 0.22, start: 59851, end: 95350 },
    { rate: 0.24, start: 95351, end: 182100 },
    { rate: 0.32, start: 182101, end: 231250 },
    { rate: 0.35, start: 231251, end: 578100 },
    { rate: 0.37, start: 578101, end: Infinity },
  ],
};

export const standardDeductions = {
  Single: 13850,
  MFJ: 27700,
  MFS: 13850,
  HH: 20800,
  QSS: 27700,
};

export const socialSecurityRate = 0.124;
export const socialSecurityWageBase = 168600;
export const seBaseMultiplier = 0.9235;
export const medicareRate = 0.029;
export const additionalMedicareRate = 0.009;
export const additionalMedicareThreshold = {
  Single: 200000,
  MFJ: 250000,
  MFS: 200000,
  HH: 125000,
  QSS: 250000,
};
