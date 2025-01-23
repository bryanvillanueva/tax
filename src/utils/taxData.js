export const taxBrackets = {
  Single: [
    { rate: 0.10, start: 0, end: 11600 },
    { rate: 0.12, start: 11601, end: 47150 },
    { rate: 0.22, start: 47151, end: 100525 },
    { rate: 0.24, start: 100526, end: 191950 },
    { rate: 0.32, start: 191951, end: 243725 },
    { rate: 0.35, start: 243726, end: 609350 },
    { rate: 0.37, start: 609351, end: Infinity },
  ],
  MFJ: [
    { rate: 0.10, start: 0, end: 23200 },
    { rate: 0.12, start: 23201, end: 94300 },
    { rate: 0.22, start: 94301, end: 201050 },
    { rate: 0.24, start: 201051, end: 383900 },
    { rate: 0.32, start: 383901, end: 487450 },
    { rate: 0.35, start: 487451, end: 731200 },
    { rate: 0.37, start: 731201, end: Infinity },
  ],
  MFS: [
    { rate: 0.10, start: 0, end: 11600 },
    { rate: 0.12, start: 11601, end: 47150 },
    { rate: 0.22, start: 47151, end: 100525 },
    { rate: 0.24, start: 100526, end: 191950 },
    { rate: 0.32, start: 191951, end: 243725 },
    { rate: 0.35, start: 243726, end: 365600 },
    { rate: 0.37, start: 365601, end: Infinity },
  ],
  HH: [
    { rate: 0.10, start: 0, end: 16550 },
    { rate: 0.12, start: 16551, end: 63100 },
    { rate: 0.22, start: 63101, end: 100500 },
    { rate: 0.24, start: 100501, end: 191950 },
    { rate: 0.32, start: 191951, end: 243700 },
    { rate: 0.35, start: 243701, end: 609350 },
    { rate: 0.37, start: 609351, end: Infinity },
  ],
  QSS: [
    { rate: 0.10, start: 0, end: 23200 },
    { rate: 0.12, start: 23201, end: 94300 },
    { rate: 0.22, start: 94301, end: 201050 },
    { rate: 0.24, start: 201051, end: 383900 },
    { rate: 0.32, start: 383901, end: 487450 },
    { rate: 0.35, start: 487451, end: 731200 },
    { rate: 0.37, start: 731201, end: Infinity },
  ],
};

export const taxAccumulators = {
  Single: [
    1160.00,
    5426.00,
    17168.50,
    39110.50,
    55678.50,
    183647.25
  ],
  MFJ: [
  2320.00, 
  10852.00,
  34337.00, 
  78221.00, 
  111357.00, 
  196669.50
],
  MFS: [
   1160.00, 
   5426.00, 
   17168.50, 
   39110.50, 
   55678.50, 
   98334.75
  ],
  HH: [
  1665.00, 
  7241.00, 
  15469.00, 
  37417.00, 
  53977.00, 
  181954.50
],
  QSS: [
    2320.00, 
    10852.00, 
    34337.00, 
    78221.00, 
    111357.00, 
    196669.50
  ]
    ,
};

export const standardDeductions = {
  Single: 14600,
  MFJ: 29200,
  MFS: 14600,
  HH: 21900,
  QSS: 29200,
};

export const socialSecurityRate = 0.124;
export const socialSecurityWageBase = 168600;
export const seBaseMultiplier = 0.9235;
export const medicareRate = 0.029;
export const additionalMedicareRate = 0.009;
export const niitRate = 0.038;
export const additionalMedicareThreshold = {
  Single: 200000,
  MFJ: 250000,
  MFS: 125000,
  HH: 200000,
  QSS: 250000,
};

export const niitThresholds = {
  Single: 200000,
  MFJ: 250000,
  MFS: 125000,
  HH: 200000,
  QSS: 250000,
};
