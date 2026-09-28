import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { PrismaClient } from '@prisma/client';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const prisma = new PrismaClient();

interface GeoRow {
  province_code: string;
  province_kh: string;
  province_en: string;
  district_code: string;
  district_kh: string;
  district_en: string;
  commune_code: string;
  commune_kh: string;
  commune_en: string;
  village_code: string;
  village_kh: string;
  village_en: string;
}

// Known Province coordinates for mapping
const PROVINCE_COORDS: Record<string, { lat: number; lng: number; type: string }> = {
  '01': { lat: 13.5859, lng: 102.9737, type: 'Province' },
  '02': { lat: 13.0957, lng: 103.2022, type: 'Province' },
  '03': { lat: 12.0000, lng: 105.4500, type: 'Province' },
  '04': { lat: 12.2500, lng: 104.6667, type: 'Province' },
  '05': { lat: 11.4500, lng: 104.5167, type: 'Province' },
  '06': { lat: 11.5833, lng: 105.7500, type: 'Province' },
  '07': { lat: 10.6000, lng: 104.1833, type: 'Province' },
  '08': { lat: 11.4500, lng: 105.0000, type: 'Province' },
  '09': { lat: 11.6167, lng: 103.1167, type: 'Province' },
  '10': { lat: 12.4833, lng: 106.0167, type: 'Province' },
  '11': { lat: 12.7833, lng: 107.2000, type: 'Province' },
  '12': { lat: 11.5564, lng: 104.9282, type: 'Municipality' },
  '13': { lat: 13.7833, lng: 105.0000, type: 'Province' },
  '14': { lat: 11.1000, lng: 105.6000, type: 'Province' },
  '15': { lat: 12.5333, lng: 103.9167, type: 'Province' },
  '16': { lat: 13.7333, lng: 107.0000, type: 'Province' },
  '17': { lat: 13.3671, lng: 103.8448, type: 'Province' },
  '18': { lat: 10.6275, lng: 103.5222, type: 'Province' },
  '19': { lat: 13.5259, lng: 105.9683, type: 'Province' },
  '20': { lat: 11.0833, lng: 105.8000, type: 'Province' },
  '21': { lat: 10.9833, lng: 104.7833, type: 'Province' },
  '22': { lat: 14.1667, lng: 103.5000, type: 'Province' },
  '23': { lat: 10.4833, lng: 104.3167, type: 'Province' },
  '24': { lat: 11.4500, lng: 103.8500, type: 'Province' },
  '25': { lat: 11.9833, lng: 105.9500, type: 'Province' },
};

async function main() {
  const startTime = performance.now();
  console.log('🇰🇭 KhmerAPI — Starting Full Cambodia 2025 Geographical Import...');

  let csvPath = path.resolve(__dirname, '../CambodiaGeographicalList2025.csv');
  if (!fs.existsSync(csvPath)) {
    csvPath = path.resolve(process.cwd(), 'CambodiaGeographicalList2025.csv');
  }
  if (!fs.existsSync(csvPath)) {
    csvPath = path.resolve(__dirname, '../CambodiaVillagesList2025.csv');
  }
  if (!fs.existsSync(csvPath)) {
    csvPath = path.resolve(process.cwd(), 'CambodiaVillagesList2025.csv');
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found. Checked: ${csvPath}`);
    process.exit(1);
  }
  console.log(`  📂 Using CSV: ${csvPath}`);

  // 1. Ensure Country exists
  const country = await prisma.country.upsert({
    where: { code: 'KH' },
    update: {},
    create: {
      code: 'KH',
      name_km: 'ព្រះរាជាណាចក្រកម្ពុជា',
      name_en: 'Kingdom of Cambodia',
      iso3: 'KHM',
      num_code: '116',
      phone_code: '+855',
      is_active: true,
    },
  });
  console.log(`  ✓ Country verified: ${country.name_en} (${country.code})`);

  // 2. Stream and Parse CSV
  const provinceMap = new Map<string, { code: string; name_km: string; name_en: string }>();
  const districtMap = new Map<string, { code: string; province_code: string; name_km: string; name_en: string }>();
  const communeMap = new Map<string, { code: string; district_code: string; name_km: string; name_en: string }>();
  const villageList: Array<{ code: string; commune_code: string; name_km: string; name_en: string }> = [];
  const villageCodeSet = new Set<string>();

  const fileStream = fs.createReadStream(csvPath, { encoding: 'utf-8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  let isHeader = true;

  for await (const line of rl) {
    if (!line || !line.trim()) continue;
    if (isHeader) {
      isHeader = false;
      continue;
    }

    lineCount++;
    const parts = line.split(',').map((p) => p.trim());
    if (parts.length < 12) continue;

    const [
      province_code,
      province_kh,
      province_en,
      district_code,
      district_kh,
      district_en,
      commune_code,
      commune_kh,
      commune_en,
      village_code,
      village_kh,
      village_en,
    ] = parts;

    // Pad province code to 2 digits if needed (e.g. "1" -> "01")
    const pCode = province_code.padStart(2, '0');
    const dCode = district_code.padStart(4, '0');
    const cCode = commune_code.padStart(6, '0');
    const vCode = village_code.padStart(8, '0');

    // Store Province
    if (!provinceMap.has(pCode)) {
      provinceMap.set(pCode, {
        code: pCode,
        name_km: pCode === '12' && !province_kh.includes('រាជធានី') ? `រាជធានី${province_kh}` : (pCode !== '12' && !province_kh.includes('ខេត្ត') ? `ខេត្ត${province_kh}` : province_kh),
        name_en: province_en,
      });
    }

    // Store District
    if (!districtMap.has(dCode)) {
      districtMap.set(dCode, {
        code: dCode,
        province_code: pCode,
        name_km: district_kh,
        name_en: district_en,
      });
    }

    // Store Commune
    if (!communeMap.has(cCode)) {
      communeMap.set(cCode, {
        code: cCode,
        district_code: dCode,
        name_km: commune_kh,
        name_en: commune_en,
      });
    }

    // Store Village (deduplicated by code)
    if (!villageCodeSet.has(vCode)) {
      villageCodeSet.add(vCode);
      villageList.push({
        code: vCode,
        commune_code: cCode,
        name_km: village_kh,
        name_en: village_en,
      });
    }
  }

  console.log(`\n📊 Parsed ${lineCount} rows from CSV:`);
  console.log(`  • Provinces: ${provinceMap.size}`);
  console.log(`  • Districts: ${districtMap.size}`);
  console.log(`  • Communes: ${communeMap.size}`);
  console.log(`  • Villages: ${villageList.length}`);

  // 3. Upsert Provinces into Database
  console.log('\n📥 Ingesting Provinces...');
  const provinceIdMap = new Map<string, string>();

  for (const p of provinceMap.values()) {
    const meta = PROVINCE_COORDS[p.code] || { lat: null, lng: null, type: 'Province' };
    const prov = await prisma.province.upsert({
      where: { code: p.code },
      update: {
        name_km: p.name_km,
        name_en: p.name_en,
        slug: slugify(p.name_en),
        type: meta.type,
        latitude: meta.lat,
        longitude: meta.lng,
        is_active: true,
      },
      create: {
        country_id: country.id,
        code: p.code,
        name_km: p.name_km,
        name_en: p.name_en,
        slug: slugify(p.name_en),
        type: meta.type,
        latitude: meta.lat,
        longitude: meta.lng,
        is_active: true,
      },
    });
    provinceIdMap.set(p.code, prov.id);
  }
  console.log(`  ✓ Upserted ${provinceIdMap.size} provinces`);

  // 4. Ingest Districts
  console.log('📥 Ingesting Districts...');
  const districtIdMap = new Map<string, string>();

  for (const d of districtMap.values()) {
    const pId = provinceIdMap.get(d.province_code);
    if (!pId) continue;

    const isKhan = d.province_code === '12';
    const distType = isKhan ? 'Khan' : 'Srok';

    const dist = await prisma.district.upsert({
      where: { code: d.code },
      update: {
        province_id: pId,
        name_km: d.name_km,
        name_en: d.name_en,
        slug: slugify(d.name_en),
        type: distType,
        is_active: true,
      },
      create: {
        province_id: pId,
        code: d.code,
        name_km: d.name_km,
        name_en: d.name_en,
        slug: slugify(d.name_en),
        type: distType,
        is_active: true,
      },
    });
    districtIdMap.set(d.code, dist.id);
  }
  console.log(`  ✓ Upserted ${districtIdMap.size} districts`);

  // 5. Ingest Communes
  console.log('📥 Ingesting Communes in batches...');
  const communeIdMap = new Map<string, string>();

  for (const c of communeMap.values()) {
    const dId = districtIdMap.get(c.district_code);
    if (!dId) continue;

    const isSangkat = c.code.startsWith('12') || c.name_km.includes('សង្កាត់');
    const commType = isSangkat ? 'Sangkat' : 'Khum';

    const comm = await prisma.commune.upsert({
      where: { code: c.code },
      update: {
        district_id: dId,
        name_km: c.name_km,
        name_en: c.name_en,
        slug: slugify(c.name_en),
        type: commType,
        is_active: true,
      },
      create: {
        district_id: dId,
        code: c.code,
        name_km: c.name_km,
        name_en: c.name_en,
        slug: slugify(c.name_en),
        type: commType,
        is_active: true,
      },
    });
    communeIdMap.set(c.code, comm.id);
  }
  console.log(`  ✓ Upserted ${communeIdMap.size} communes`);

  // 6. Bulk Ingest Villages (14,000+ items in chunks of 1000)
  console.log('📥 Bulk ingesting 14,000+ Villages...');
  const villageRecords = villageList
    .map((v) => {
      const cId = communeIdMap.get(v.commune_code);
      if (!cId) return null;
      return {
        commune_id: cId,
        code: v.code,
        name_km: v.name_km,
        name_en: v.name_en,
        slug: slugify(v.name_en),
        is_active: true,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  const CHUNK_SIZE = 1000;
  let insertedVillages = 0;

  for (let i = 0; i < villageRecords.length; i += CHUNK_SIZE) {
    const chunk = villageRecords.slice(i, i + CHUNK_SIZE);
    const result = await prisma.village.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    insertedVillages += result.count;
    process.stdout.write(`  → Inserted ${insertedVillages}/${villageRecords.length} villages...\r`);
  }
  console.log(`\n  ✓ Processed ${villageRecords.length} villages into database`);

  // 7. Register Data Source Provenance
  const existingSource = await prisma.dataSource.findFirst({
    where: { name: 'Cambodia Geographical Database 2025' },
  });

  if (existingSource) {
    await prisma.dataSource.update({
      where: { id: existingSource.id },
      data: { last_verified_at: new Date() },
    });
  } else {
    await prisma.dataSource.create({
      data: {
        name: 'Cambodia Geographical Database 2025',
        organization: 'Ministry of Planning / National Institute of Statistics (NIS)',
        url: 'https://www.nis.gov.kh',
        license: 'Public Open Data (Government of Cambodia)',
        description: 'Complete national geographic gazetteer containing all 25 provinces, 210 districts, 1,661 communes, and 14,528 villages.',
        last_verified_at: new Date(),
      },
    });
  }

  const durationSec = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log('\n====================================================');
  console.log('✅ ALL CAMBODIA GEO DATA IMPORTED SUCCESSFULLY!');
  console.log(`⏱️ Total Time: ${durationSec}s`);
  console.log('====================================================');

  // Verify Counts
  const counts = {
    provinces: await prisma.province.count(),
    districts: await prisma.district.count(),
    communes: await prisma.commune.count(),
    villages: await prisma.village.count(),
  };
  console.log(`\n📍 Live Database Counts:`);
  console.log(`  • Provinces: ${counts.provinces}`);
  console.log(`  • Districts: ${counts.districts}`);
  console.log(`  • Communes:  ${counts.communes}`);
  console.log(`  • Villages:  ${counts.villages}`);
  console.log('====================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Import error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
