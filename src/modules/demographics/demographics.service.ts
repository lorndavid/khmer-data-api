import { redisCache } from '../../config/redis.js';

export interface PopulationRecord {
  year: number;
  year_km: string;
  population_millions: number;
  population_total: number;
  population_km: string;
  growth_since_previous_pct: number | null;
  growth_rate_annual_pct: number | null;
  source: string;
  source_km: string;
}

export const CAMBODIA_HISTORICAL_POPULATION: PopulationRecord[] = [
  {
    year: 1962,
    year_km: '១៩៦២',
    population_millions: 5.7,
    population_total: 5700000,
    population_km: '៥.៧ លាននាក់',
    growth_since_previous_pct: null,
    growth_rate_annual_pct: null,
    source: 'General Population Census of Cambodia 1962',
    source_km: 'ជំរឿនប្រជាជនទូទៅនៃប្រទេសកម្ពុជា ឆ្នាំ១៩៦២',
  },
  {
    year: 1980,
    year_km: '១៩៨០',
    population_millions: 6.6,
    population_total: 6600000,
    population_km: '៦.៦ លាននាក់',
    growth_since_previous_pct: 15.79,
    growth_rate_annual_pct: 0.81,
    source: 'UN Demographic Assessment & Post-conflict Estimate',
    source_km: 'ការប៉ាន់ប្រមាណស្ថិតិប្រជាជនក្រោយសង្គ្រាម',
  },
  {
    year: 1994,
    year_km: '១៩៩៤',
    population_millions: 9.9,
    population_total: 9900000,
    population_km: '៩.៩ លាននាក់',
    growth_since_previous_pct: 50.0,
    growth_rate_annual_pct: 2.93,
    source: 'National Institute of Statistics (NIS) Socio-Economic Survey',
    source_km: 'ការអង្កេតសេដ្ឋកិច្ច-សង្គមកិច្ចកម្ពុជា',
  },
  {
    year: 1996,
    year_km: '១៩៩៦',
    population_millions: 10.7,
    population_total: 10700000,
    population_km: '១០.៧ លាននាក់',
    growth_since_previous_pct: 8.08,
    growth_rate_annual_pct: 3.96,
    source: 'Demographic Survey of Cambodia 1996',
    source_km: 'ការអង្កេតប្រជាសាស្ត្រកម្ពុជា ឆ្នាំ១៩៩៦',
  },
  {
    year: 1998,
    year_km: '១៩៩៨',
    population_millions: 11.4,
    population_total: 11400000,
    population_km: '១១.៤ លាននាក់',
    growth_since_previous_pct: 6.54,
    growth_rate_annual_pct: 3.22,
    source: 'General Population Census of Cambodia 1998 (NIS)',
    source_km: 'ជំរឿនប្រជាជនទូទៅនៃព្រះរាជាណាចក្រកម្ពុជា ឆ្នាំ១៩៩៨',
  },
  {
    year: 2004,
    year_km: '២០០៤',
    population_millions: 12.8,
    population_total: 12800000,
    population_km: '១២.៨ លាននាក់',
    growth_since_previous_pct: 12.28,
    growth_rate_annual_pct: 1.95,
    source: 'Cambodia Inter-Censal Population Survey 2004',
    source_km: 'ការអង្កេតចន្លោះជំរឿនប្រជាជនកម្ពុជា ឆ្នាំ២០០៤',
  },
  {
    year: 2008,
    year_km: '២០០៨',
    population_millions: 13.4,
    population_total: 13400000,
    population_km: '១៣.៤ លាននាក់',
    growth_since_previous_pct: 4.69,
    growth_rate_annual_pct: 1.15,
    source: 'General Population Census of Cambodia 2008',
    source_km: 'ជំរឿនប្រជាជនទូទៅនៃព្រះរាជាណាចក្រកម្ពុជា ឆ្នាំ២០០៨',
  },
  {
    year: 2013,
    year_km: '២០១៣',
    population_millions: 14.7,
    population_total: 14700000,
    population_km: '១៤.៧ លាននាក់',
    growth_since_previous_pct: 9.70,
    growth_rate_annual_pct: 1.87,
    source: 'Cambodia Inter-Censal Population Survey 2013',
    source_km: 'ការអង្កេតចន្លោះជំរឿនប្រជាជនកម្ពុជា ឆ្នាំ២០១៣',
  },
  {
    year: 2019,
    year_km: '២០១៩',
    population_millions: 15.6,
    population_total: 15600000,
    population_km: '១៥.៦ លាននាក់',
    growth_since_previous_pct: 6.12,
    growth_rate_annual_pct: 1.00,
    source: 'General Population Census of Cambodia 2019 (NIS & MoP)',
    source_km: 'ជំរឿនប្រជាជនទូទៅនៃព្រះរាជាណាចក្រកម្ពុជា ឆ្នាំ២០១៩',
  },
  {
    year: 2024,
    year_km: '២០២៤',
    population_millions: 17.3,
    population_total: 17300000,
    population_km: '១៧.៣ លាននាក់',
    growth_since_previous_pct: 10.90,
    growth_rate_annual_pct: 2.09,
    source: 'National Institute of Statistics (NIS) 2024 Official Projection',
    source_km: 'របាយការណ៍ព្យាករណ៍ប្រជាជនផ្លូវការ ឆ្នាំ២០២៤ (ក្រសួងផែនការ)',
  },
];

export const PROVINCE_POPULATION_ESTIMATES = [
  { code: '12', name_en: 'Phnom Penh', name_km: 'រាជធានីភ្នំពេញ', population_estimate: 2280000, population_km: '២.២៨ លាននាក់', pct_of_total: 13.18 },
  { code: '08', name_en: 'Kandal', name_km: 'ខេត្តកណ្តាល', population_estimate: 1280000, population_km: '១.២៨ លាននាក់', pct_of_total: 7.40 },
  { code: '17', name_en: 'Siem Reap', name_km: 'ខេត្តសៀមរាប', population_estimate: 1080000, population_km: '១.០៨ លាននាក់', pct_of_total: 6.24 },
  { code: '03', name_en: 'Kampong Cham', name_km: 'ខេត្តកំពង់ចាម', population_estimate: 1050000, population_km: '១.០៥ លាននាក់', pct_of_total: 6.07 },
  { code: '02', name_en: 'Battambang', name_km: 'ខេត្តបាត់ដំបង', population_estimate: 1040000, population_km: '១.០៤ លាននាក់', pct_of_total: 6.01 },
  { code: '21', name_en: 'Takeo', name_km: 'ខេត្តតាកែវ', population_estimate: 960000, population_km: '៩៦ ម៉ឺននាក់', pct_of_total: 5.55 },
  { code: '14', name_en: 'Prey Veng', name_km: 'ខេត្តព្រៃវែង', population_estimate: 940000, population_km: '៩៤ ម៉ឺននាក់', pct_of_total: 5.43 },
  { code: '01', name_en: 'Banteay Meanchey', name_km: 'ខេត្តបន្ទាយមានជ័យ', population_estimate: 880000, population_km: '៨៨ ម៉ឺននាក់', pct_of_total: 5.09 },
  { code: '05', name_en: 'Kampong Thom', name_km: 'ខេត្តកំពង់ធំ', population_estimate: 730000, population_km: '៧៣ ម៉ឺននាក់', pct_of_total: 4.22 },
  { code: '04', name_en: 'Kampong Chhnang', name_km: 'ខេត្តកំពង់ឆ្នាំង', population_estimate: 560000, population_km: '៥៦ ម៉ឺននាក់', pct_of_total: 3.24 },
  { code: '07', name_en: 'Kampot', name_km: 'ខេត្តកំពត', population_estimate: 640000, population_km: '៦៤ ម៉ឺននាក់', pct_of_total: 3.70 },
  { code: '06', name_en: 'Kampong Speu', name_km: 'ខេត្តកំពង់ស្ពឺ', population_estimate: 910000, population_km: '៩១ ម៉ឺននាក់', pct_of_total: 5.26 },
  { code: '18', name_en: 'Preah Sihanouk', name_km: 'ខេត្តព្រះសីហនុ', population_estimate: 330000, population_km: '៣៣ ម៉ឺននាក់', pct_of_total: 1.91 },
  { code: '20', name_en: 'Svay Rieng', name_km: 'ខេត្តស្វាយរៀង', population_estimate: 540000, population_km: '៥៤ ម៉ឺននាក់', pct_of_total: 3.12 },
  { code: '15', name_en: 'Pursat', name_km: 'ខេត្តពោធិ៍សាត់', population_estimate: 440000, population_km: '៤៤ ម៉ឺននាក់', pct_of_total: 2.54 },
  { code: '19', name_en: 'Stung Treng', name_km: 'ខេត្តស្ទឹងត្រែង', population_estimate: 170000, population_km: '១៧ ម៉ឺននាក់', pct_of_total: 0.98 },
  { code: '13', name_en: 'Preah Vihear', name_km: 'ខេត្តព្រះវិហារ', population_estimate: 280000, population_km: '២៨ ម៉ឺននាក់', pct_of_total: 1.62 },
  { code: '16', name_en: 'Ratanak Kiri', name_km: 'ខេត្តរតនគិរី', population_estimate: 230000, population_km: '២៣ ម៉ឺននាក់', pct_of_total: 1.33 },
  { code: '11', name_en: 'Mondul Kiri', name_km: 'ខេត្តមណ្ឌលគិរី', population_estimate: 96000, population_km: '៩.៦ ម៉ឺននាក់', pct_of_total: 0.55 },
  { code: '10', name_en: 'Kratie', name_km: 'ខេត្តក្រចេះ', population_estimate: 410000, population_km: '៤១ ម៉ឺននាក់', pct_of_total: 2.37 },
  { code: '09', name_en: 'Koh Kong', name_km: 'ខេត្តកោះកុង', population_estimate: 140000, population_km: '១៤ ម៉ឺននាក់', pct_of_total: 0.81 },
  { code: '22', name_en: 'Oddar Meanchey', name_km: 'ខេត្តឧត្តរមានជ័យ', population_estimate: 290000, population_km: '២៩ ម៉ឺននាក់', pct_of_total: 1.68 },
  { code: '23', name_en: 'Kep', name_km: 'ខេត្តកែប', population_estimate: 44000, population_km: '៤.៤ ម៉ឺននាក់', pct_of_total: 0.25 },
  { code: '24', name_en: 'Pailin', name_km: 'ខេត្តប៉ៃលិន', population_estimate: 77000, population_km: '៧.៧ ម៉ឺននាក់', pct_of_total: 0.45 },
  { code: '25', name_en: 'Tboung Khmum', name_km: 'ខេត្តត្បូងឃ្មុំ', population_estimate: 820000, population_km: '៨២ ម៉ឺននាក់', pct_of_total: 4.74 },
];

export class DemographicsService {
  async getPopulationData(options?: { from?: number; to?: number }) {
    const cacheKey = `demographics:population:${options?.from || 'all'}:${options?.to || 'all'}`;
    const cached = await redisCache.get(cacheKey);
    if (cached) return cached;

    let records = [...CAMBODIA_HISTORICAL_POPULATION];

    if (options?.from) {
      records = records.filter((r) => r.year >= options.from!);
    }
    if (options?.to) {
      records = records.filter((r) => r.year <= options.to!);
    }

    const latest = CAMBODIA_HISTORICAL_POPULATION[CAMBODIA_HISTORICAL_POPULATION.length - 1];
    const initial = CAMBODIA_HISTORICAL_POPULATION[0];
    const overallGrowthPct = Number(
      (((latest.population_millions - initial.population_millions) / initial.population_millions) * 100).toFixed(2)
    );

    const payload = {
      country: 'Kingdom of Cambodia',
      country_km: 'ព្រះរាជាណាចក្រកម្ពុជា',
      latest: {
        year: latest.year,
        year_km: latest.year_km,
        population_millions: latest.population_millions,
        population_total: latest.population_total,
        population_km: latest.population_km,
        annual_growth_rate_pct: latest.growth_rate_annual_pct,
      },
      summary: {
        baseline_year: initial.year,
        baseline_population_millions: initial.population_millions,
        total_growth_percentage: overallGrowthPct,
        total_milestones: records.length,
        source_authority: 'National Institute of Statistics, Ministry of Planning, Cambodia',
        source_authority_km: 'វិទ្យាស្ថានជាតិស្ថិតិ ក្រសួងផែនការ នៃព្រះរាជាណាចក្រកម្ពុជា',
      },
      historical: records,
      province_estimates: PROVINCE_POPULATION_ESTIMATES,
    };

    await redisCache.set(cacheKey, payload, 3600); // 1 hour cache
    return payload;
  }
}

export const demographicsService = new DemographicsService();
