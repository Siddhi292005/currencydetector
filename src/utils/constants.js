export const CURRENCIES = {
  INR: { name: 'Indian Rupee',   country: 'India',          flag: '🇮🇳', symbol: '₹', accent: '#ff9f43' },
  USD: { name: 'US Dollar',      country: 'United States',  flag: '🇺🇸', symbol: '$', accent: '#c9a84c' },
  EUR: { name: 'Euro',           country: 'European Union', flag: '🇪🇺', symbol: '€', accent: '#d4af37' },
}

export const LIVE_RATES = {
  INR: 1.0,
  USD: 83.5,
  EUR: 90.1,
}

export const HISTORICAL_RATES = {
  USD: [
    { year: '2015', rate: 64.2  },
    { year: '2016', rate: 67.1  },
    { year: '2017', rate: 65.1  },
    { year: '2018', rate: 68.4  },
    { year: '2019', rate: 70.4  },
    { year: '2020', rate: 74.1  },
    { year: '2021', rate: 73.9  },
    { year: '2022', rate: 78.6  },
    { year: '2023', rate: 82.6  },
    { year: '2024', rate: 83.5  },
    { year: '2025', rate: 84.2  },
  ],
  EUR: [
    { year: '2015', rate: 71.2  },
    { year: '2016', rate: 74.4  },
    { year: '2017', rate: 73.5  },
    { year: '2018', rate: 80.1  },
    { year: '2019', rate: 78.3  },
    { year: '2020', rate: 84.6  },
    { year: '2021', rate: 87.5  },
    { year: '2022', rate: 82.7  },
    { year: '2023', rate: 89.0  },
    { year: '2024', rate: 90.1  },
    { year: '2025', rate: 91.5  },
  ],
  INR: [
    { year: '2015', rate: 1.0 },
    { year: '2016', rate: 1.0 },
    { year: '2017', rate: 1.0 },
    { year: '2018', rate: 1.0 },
    { year: '2019', rate: 1.0 },
    { year: '2020', rate: 1.0 },
    { year: '2021', rate: 1.0 },
    { year: '2022', rate: 1.0 },
    { year: '2023', rate: 1.0 },
    { year: '2024', rate: 1.0 },
    { year: '2025', rate: 1.0 },
  ],
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'