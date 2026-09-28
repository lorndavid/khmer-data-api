import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KhmerAPI database seeding...');

  // 1. Seed Roles
  console.log('  → Seeding system roles...');
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: {
      name: 'super_admin',
      description: 'Super Administrator with unrestricted access to all platform systems',
      is_system: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with platform data and user management access',
      is_system: true,
    },
  });

  await prisma.role.upsert({
    where: { name: 'data_manager' },
    update: {},
    create: {
      name: 'data_manager',
      description: 'Data Manager responsible for geographic datasets, imports, and exports',
      is_system: true,
    },
  });

  await prisma.role.upsert({
    where: { name: 'support' },
    update: {},
    create: {
      name: 'support',
      description: 'Support staff with read and audit viewing permissions',
      is_system: true,
    },
  });

  await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      description: 'Default viewer account with public API access',
      is_system: true,
    },
  });

  // 2. Seed Permissions
  console.log('  → Seeding system permissions...');
  const permissionsList = [
    { code: 'province.read', description: 'Read province records', module: 'provinces' },
    { code: 'province.create', description: 'Create province records', module: 'provinces' },
    { code: 'province.update', description: 'Update province records', module: 'provinces' },
    { code: 'province.delete', description: 'Delete province records', module: 'provinces' },
    { code: 'district.read', description: 'Read district records', module: 'districts' },
    { code: 'district.create', description: 'Create district records', module: 'districts' },
    { code: 'district.update', description: 'Update district records', module: 'districts' },
    { code: 'district.delete', description: 'Delete district records', module: 'districts' },
    { code: 'commune.read', description: 'Read commune records', module: 'communes' },
    { code: 'commune.create', description: 'Create commune records', module: 'communes' },
    { code: 'commune.update', description: 'Update commune records', module: 'communes' },
    { code: 'commune.delete', description: 'Delete commune records', module: 'communes' },
    { code: 'village.read', description: 'Read village records', module: 'villages' },
    { code: 'village.create', description: 'Create village records', module: 'villages' },
    { code: 'village.update', description: 'Update village records', module: 'villages' },
    { code: 'village.delete', description: 'Delete village records', module: 'villages' },
    { code: 'postal_code.read', description: 'Read postal code records', module: 'postal_codes' },
    { code: 'postal_code.create', description: 'Create postal code records', module: 'postal_codes' },
    { code: 'postal_code.update', description: 'Update postal code records', module: 'postal_codes' },
    { code: 'postal_code.delete', description: 'Delete postal code records', module: 'postal_codes' },
    { code: 'data.import', description: 'Import datasets in bulk', module: 'imports' },
    { code: 'data.export', description: 'Export datasets', module: 'exports' },
    { code: 'users.manage', description: 'Manage platform users', module: 'users' },
    { code: 'api_keys.manage', description: 'Manage developer API keys', module: 'api_keys' },
    { code: 'audit_logs.view', description: 'View admin audit logs', module: 'audit_logs' },
    { code: 'system.view', description: 'View system health and stats', module: 'system' },
  ];

  for (const perm of permissionsList) {
    const p = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });

    // Link all to super_admin and admin
    await prisma.rolePermission.upsert({
      where: { role_id_permission_id: { role_id: superAdminRole.id, permission_id: p.id } },
      update: {},
      create: { role_id: superAdminRole.id, permission_id: p.id },
    });

    await prisma.rolePermission.upsert({
      where: { role_id_permission_id: { role_id: adminRole.id, permission_id: p.id } },
      update: {},
      create: { role_id: adminRole.id, permission_id: p.id },
    });
  }

  // 3. Seed Default Super Admin User
  console.log('  → Seeding super admin account...');
  const passwordHash = await bcrypt.hash('KhmerAPI@2026', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@khmerapi.dev' },
    update: {},
    create: {
      email: 'admin@khmerapi.dev',
      password_hash: passwordHash,
      first_name: 'KhmerAPI',
      last_name: 'Admin',
      role_id: superAdminRole.id,
      is_active: true,
    },
  });

  // Create an initial developer API key for demonstration
  await prisma.apiKey.upsert({
    where: { key_hash: 'c878fb6e7b1655f4625b5a0349b1c53e8d98d02df93627d35368a3068e1abcf5' },
    update: {},
    create: {
      user_id: adminUser.id,
      name: 'Default KhmerAPI Demo Key',
      key_prefix: 'kh_live_demo01',
      key_hash: 'c878fb6e7b1655f4625b5a0349b1c53e8d98d02df93627d35368a3068e1abcf5',
      rate_limit: 1000,
    },
  });

  // 4. Seed Country (Cambodia)
  console.log('  → Seeding country Cambodia (KH)...');
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
    },
  });

  // 5. Seed Official Cambodia Provinces (All 25 Subdivisions)
  console.log('  → Seeding all 25 Cambodia provinces with official codes...');
  const provinces = [
    { code: '01', name_km: 'ខេត្តបន្ទាយមានជ័យ', name_en: 'Banteay Meanchey', slug: 'banteay-meanchey', type: 'Province', latitude: 13.5859, longitude: 102.9737 },
    { code: '02', name_km: 'ខេត្តបាត់ដំបង', name_en: 'Battambang', slug: 'battambang', type: 'Province', latitude: 13.0957, longitude: 103.2022 },
    { code: '03', name_km: 'ខេត្តកំពង់ចាម', name_en: 'Kampong Cham', slug: 'kampong-cham', type: 'Province', latitude: 11.9924, longitude: 105.4645 },
    { code: '04', name_km: 'ខេត្តកំពង់ឆ្នាំង', name_en: 'Kampong Chhnang', slug: 'kampong-chhnang', type: 'Province', latitude: 12.25, longitude: 104.6667 },
    { code: '05', name_km: 'ខេត្តកំពង់ស្ពឺ', name_en: 'Kampong Speu', slug: 'kampong-speu', type: 'Province', latitude: 11.4532, longitude: 104.5209 },
    { code: '06', name_km: 'ខេត្តកំពង់ធំ', name_en: 'Kampong Thom', slug: 'kampong-thom', type: 'Province', latitude: 12.7111, longitude: 104.8887 },
    { code: '07', name_km: 'ខេត្តកំពត', name_en: 'Kampot', slug: 'kampot', type: 'Province', latitude: 10.6104, longitude: 104.1815 },
    { code: '08', name_km: 'ខេត្តកណ្តាល', name_en: 'Kandal', slug: 'kandal', type: 'Province', latitude: 11.4578, longitude: 104.9497 },
    { code: '09', name_km: 'ខេត្តកោះកុង', name_en: 'Koh Kong', slug: 'koh-kong', type: 'Province', latitude: 11.6154, longitude: 102.9838 },
    { code: '10', name_km: 'ខេត្តក្រចេះ', name_en: 'Kratie', slug: 'kratie', type: 'Province', latitude: 12.4881, longitude: 106.0188 },
    { code: '11', name_km: 'ខេត្តមណ្ឌលគិរី', name_en: 'Mondulkiri', slug: 'mondulkiri', type: 'Province', latitude: 12.4558, longitude: 107.1879 },
    { code: '12', name_km: 'រាជធានីភ្នំពេញ', name_en: 'Phnom Penh', slug: 'phnom-penh', type: 'Municipality', latitude: 11.5564, longitude: 104.9282 },
    { code: '13', name_km: 'ខេត្តព្រះវិហារ', name_en: 'Preah Vihear', slug: 'preah-vihear', type: 'Province', latitude: 13.8073, longitude: 104.9805 },
    { code: '14', name_km: 'ខេត្តព្រៃវែង', name_en: 'Prey Veng', slug: 'prey-veng', type: 'Province', latitude: 11.4868, longitude: 105.3253 },
    { code: '15', name_km: 'ខេត្តពោធិ៍សាត់', name_en: 'Pursat', slug: 'pursat', type: 'Province', latitude: 12.5388, longitude: 103.9192 },
    { code: '16', name_km: 'ខេត្តរតនគិរី', name_en: 'Ratanakiri', slug: 'ratanakiri', type: 'Province', latitude: 13.7394, longitude: 106.9873 },
    { code: '17', name_km: 'ខេត្តសៀមរាប', name_en: 'Siem Reap', slug: 'siem-reap', type: 'Province', latitude: 13.3671, longitude: 103.8448 },
    { code: '18', name_km: 'ខេត្តព្រះសីហនុ', name_en: 'Preah Sihanouk', slug: 'preah-sihanouk', type: 'Province', latitude: 10.6275, longitude: 103.5221 },
    { code: '19', name_km: 'ខេត្តស្ទឹងត្រែង', name_en: 'Stung Treng', slug: 'stung-treng', type: 'Province', latitude: 13.5259, longitude: 105.9683 },
    { code: '20', name_km: 'ខេត្តស្វាយរៀង', name_en: 'Svay Rieng', slug: 'svay-rieng', type: 'Province', latitude: 11.0879, longitude: 105.7993 },
    { code: '21', name_km: 'ខេត្តតាកែវ', name_en: 'Takeo', slug: 'takeo', type: 'Province', latitude: 10.9908, longitude: 104.7850 },
    { code: '22', name_km: 'ខេត្តឧត្តរមានជ័យ', name_en: 'Otdar Meanchey', slug: 'otdar-meanchey', type: 'Province', latitude: 14.1818, longitude: 103.5176 },
    { code: '23', name_km: 'ខេត្តកែប', name_en: 'Kep', slug: 'kep', type: 'Province', latitude: 10.4828, longitude: 104.3167 },
    { code: '24', name_km: 'ខេត្តប៉ៃលិន', name_en: 'Pailin', slug: 'pailin', type: 'Province', latitude: 12.8489, longitude: 102.6093 },
    { code: '25', name_km: 'ខេត្តត្បូងឃ្មុំ', name_en: 'Tboung Khmum', slug: 'tboung-khmum', type: 'Province', latitude: 11.8891, longitude: 105.6593 },
  ];

  const provinceMap = new Map<string, string>();
  for (const prov of provinces) {
    const p = await prisma.province.upsert({
      where: { code: prov.code },
      update: {
        name_km: prov.name_km,
        name_en: prov.name_en,
        slug: prov.slug,
        type: prov.type,
        latitude: prov.latitude,
        longitude: prov.longitude,
      },
      create: {
        code: prov.code,
        country_id: country.id,
        name_km: prov.name_km,
        name_en: prov.name_en,
        slug: prov.slug,
        type: prov.type,
        latitude: prov.latitude,
        longitude: prov.longitude,
      },
    });
    provinceMap.set(prov.code, p.id);
  }

  // 6. Seed Sample Districts (Khans / Sroks / Krongs)
  console.log('  → Seeding sample districts in Phnom Penh, Siem Reap, Battambang, Kampot...');
  const districts = [
    // Phnom Penh Khans
    { code: '1201', province_code: '12', name_km: 'ខណ្ឌចំការមន', name_en: 'Chamkar Mon', slug: 'chamkar-mon', type: 'Khan', latitude: 11.5381, longitude: 104.9288 },
    { code: '1202', province_code: '12', name_km: 'ខណ្ឌដូនពេញ', name_en: 'Doun Penh', slug: 'doun-penh', type: 'Khan', latitude: 11.5724, longitude: 104.9221 },
    { code: '1203', province_code: '12', name_km: 'ខណ្ឌប្រាំពីរមករា', name_en: 'Prampir Meakkakra', slug: 'prampir-meakkakra', type: 'Khan', latitude: 11.5621, longitude: 104.9125 },
    { code: '1204', province_code: '12', name_km: 'ខណ្ឌទួលគោក', name_en: 'Tuol Kouk', slug: 'tuol-kouk', type: 'Khan', latitude: 11.5739, longitude: 104.8986 },
    { code: '1205', province_code: '12', name_km: 'ខណ្ឌដង្កោ', name_en: 'Dangkao', slug: 'dangkao', type: 'Khan', latitude: 11.4883, longitude: 104.8569 },
    { code: '1206', province_code: '12', name_km: 'ខណ្ឌមានជ័យ', name_en: 'Mean Chey', slug: 'mean-chey', type: 'Khan', latitude: 11.5206, longitude: 104.9152 },
    { code: '1207', province_code: '12', name_km: 'ខណ្ឌឫស្សីកែវ', name_en: 'Ruessei Kaev', slug: 'ruessei-kaev', type: 'Khan', latitude: 11.6033, longitude: 104.9083 },
    { code: '1208', province_code: '12', name_km: 'ខណ្ឌសែនសុខ', name_en: 'Saensokh', slug: 'saensokh', type: 'Khan', latitude: 11.5833, longitude: 104.8667 },
    { code: '1209', province_code: '12', name_km: 'ខណ្ឌពោធិ៍សែនជ័យ', name_en: 'Pou Senchey', slug: 'pou-senchey', type: 'Khan', latitude: 11.5458, longitude: 104.8167 },
    { code: '1210', province_code: '12', name_km: 'ខណ្ឌជ្រោយចង្វារ', name_en: 'Chrouy Changva', slug: 'chrouy-changva', type: 'Khan', latitude: 11.6083, longitude: 104.9417 },
    { code: '1211', province_code: '12', name_km: 'ខណ្ឌព្រែកភ្នៅ', name_en: 'Praek Pnov', slug: 'praek-pnov', type: 'Khan', latitude: 11.6500, longitude: 104.8500 },
    { code: '1212', province_code: '12', name_km: 'ខណ្ឌច្បារអំពៅ', name_en: 'Chbar Ampov', slug: 'chbar-ampov', type: 'Khan', latitude: 11.5250, longitude: 104.9583 },
    { code: '1213', province_code: '12', name_km: 'ខណ្ឌបឹងកេងកង', name_en: 'Boeng Keng Kang', slug: 'boeng-keng-kang', type: 'Khan', latitude: 11.5486, longitude: 104.9222 },
    { code: '1214', province_code: '12', name_km: 'ខណ្ឌកំបូល', name_en: 'Kamboul', slug: 'kamboul', type: 'Khan', latitude: 11.5167, longitude: 104.7500 },
    // Siem Reap
    { code: '1703', province_code: '17', name_km: 'ស្រុកបន្ទាយស្រី', name_en: 'Banteay Srei', slug: 'banteay-srei', type: 'Srok', latitude: 13.5933, longitude: 103.9633 },
    { code: '1709', province_code: '17', name_km: 'ស្រុកប្រាសាទបាគង', name_en: 'Prasat Bakong', slug: 'prasat-bakong', type: 'Srok', latitude: 13.3333, longitude: 103.9667 },
    { code: '1710', province_code: '17', name_km: 'ក្រុងសៀមរាប', name_en: 'Siem Reap Municipality', slug: 'siem-reap', type: 'Krong', latitude: 13.3671, longitude: 103.8448 },
    // Battambang
    { code: '0203', province_code: '02', name_km: 'ក្រុងបាត់ដំបង', name_en: 'Battambang Municipality', slug: 'battambang-municipality', type: 'Krong', latitude: 13.0957, longitude: 103.2022 },
    // Kampot
    { code: '0708', province_code: '07', name_km: 'ក្រុងកំពត', name_en: 'Kampot Municipality', slug: 'kampot-municipality', type: 'Krong', latitude: 10.6104, longitude: 104.1815 },
  ];

  const districtMap = new Map<string, string>();
  for (const dist of districts) {
    const provinceId = provinceMap.get(dist.province_code);
    if (!provinceId) continue;

    const d = await prisma.district.upsert({
      where: { code: dist.code },
      update: {
        name_km: dist.name_km,
        name_en: dist.name_en,
        slug: dist.slug,
        type: dist.type,
        latitude: dist.latitude,
        longitude: dist.longitude,
      },
      create: {
        code: dist.code,
        province_id: provinceId,
        name_km: dist.name_km,
        name_en: dist.name_en,
        slug: dist.slug,
        type: dist.type,
        latitude: dist.latitude,
        longitude: dist.longitude,
      },
    });
    districtMap.set(dist.code, d.id);
  }

  // 7. Seed Sample Communes (Sangkats / Khums)
  console.log('  → Seeding sample communes in Doun Penh, Chamkar Mon, Boeng Keng Kang, Siem Reap...');
  const communes = [
    // Doun Penh Sangkats
    { code: '120201', district_code: '1202', name_km: 'សង្កាត់ផ្សារចាស់', name_en: 'Phsar Chas', slug: 'phsar-chas', type: 'Sangkat', latitude: 11.5714, longitude: 104.9250 },
    { code: '120202', district_code: '1202', name_km: 'សង្កាត់ផ្សារកណ្តាលទី១', name_en: 'Phsar Kandal Ti Muoy', slug: 'phsar-kandal-ti-muoy', type: 'Sangkat', latitude: 11.5678, longitude: 104.9272 },
    { code: '120203', district_code: '1202', name_km: 'សង្កាត់ផ្សារកណ្តាលទី២', name_en: 'Phsar Kandal Ti Pir', slug: 'phsar-kandal-ti-pir', type: 'Sangkat', latitude: 11.5661, longitude: 104.9283 },
    { code: '120204', district_code: '1202', name_km: 'សង្កាត់ផ្សារថ្មីទី១', name_en: 'Phsar Thmei Ti Muoy', slug: 'phsar-thmei-ti-muoy', type: 'Sangkat', latitude: 11.5694, longitude: 104.9214 },
    { code: '120205', district_code: '1202', name_km: 'សង្កាត់ផ្សារថ្មីទី២', name_en: 'Phsar Thmei Ti Pir', slug: 'phsar-thmei-ti-pir', type: 'Sangkat', latitude: 11.5683, longitude: 104.9189 },
    { code: '120206', district_code: '1202', name_km: 'សង្កាត់ផ្សារថ្មីទី៣', name_en: 'Phsar Thmei Ti Bei', slug: 'phsar-thmei-ti-bei', type: 'Sangkat', latitude: 11.5667, longitude: 104.9200 },
    { code: '120207', district_code: '1202', name_km: 'សង្កាត់បឹងរាំង', name_en: 'Boeng Reang', slug: 'boeng-reang', type: 'Sangkat', latitude: 11.5639, longitude: 104.9244 },
    { code: '120208', district_code: '1202', name_km: 'សង្កាត់ជ័យជំនះ', name_en: 'Chey Chumneah', slug: 'chey-chumneah', type: 'Sangkat', latitude: 11.5606, longitude: 104.9306 },
    { code: '120209', district_code: '1202', name_km: 'សង្កាត់ចតុមុខ', name_en: 'Chakto Mukh', slug: 'chakto-mukh', type: 'Sangkat', latitude: 11.5583, longitude: 104.9333 },
    { code: '120210', district_code: '1202', name_km: 'សង្កាត់ស្រះចក', name_en: 'Srah Chak', slug: 'srah-chak', type: 'Sangkat', latitude: 11.5806, longitude: 104.9194 },
    { code: '120211', district_code: '1202', name_km: 'សង្កាត់វត្តភ្នំ', name_en: 'Voat Phnum', slug: 'voat-phnum', type: 'Sangkat', latitude: 11.5761, longitude: 104.9233 },
    // Boeng Keng Kang
    { code: '121301', district_code: '1213', name_km: 'សង្កាត់បឹងកេងកងទី១', name_en: 'Boeng Keng Kang Ti Muoy', slug: 'boeng-keng-kang-ti-muoy', type: 'Sangkat', latitude: 11.5528, longitude: 104.9250 },
    { code: '121302', district_code: '1213', name_km: 'សង្កាត់បឹងកេងកងទី២', name_en: 'Boeng Keng Kang Ti Pir', slug: 'boeng-keng-kang-ti-pir', type: 'Sangkat', latitude: 11.5500, longitude: 104.9194 },
    { code: '121303', district_code: '1213', name_km: 'សង្កាត់បឹងកេងកងទី៣', name_en: 'Boeng Keng Kang Ti Bei', slug: 'boeng-keng-kang-ti-bei', type: 'Sangkat', latitude: 11.5472, longitude: 104.9167 },
    // Siem Reap Krong
    { code: '171001', district_code: '1710', name_km: 'សង្កាត់ស្លក្រាម', name_en: 'Sla Kram', slug: 'sla-kram', type: 'Sangkat', latitude: 13.3700, longitude: 103.8600 },
    { code: '171002', district_code: '1710', name_km: 'សង្កាត់ស្វាយដង្គំ', name_en: 'Svay Dangkum', slug: 'svay-dangkum', type: 'Sangkat', latitude: 13.3550, longitude: 103.8500 },
  ];

  const communeMap = new Map<string, string>();
  for (const comm of communes) {
    const districtId = districtMap.get(comm.district_code);
    if (!districtId) continue;

    const c = await prisma.commune.upsert({
      where: { code: comm.code },
      update: {
        name_km: comm.name_km,
        name_en: comm.name_en,
        slug: comm.slug,
        type: comm.type,
        latitude: comm.latitude,
        longitude: comm.longitude,
      },
      create: {
        code: comm.code,
        district_id: districtId,
        name_km: comm.name_km,
        name_en: comm.name_en,
        slug: comm.slug,
        type: comm.type,
        latitude: comm.latitude,
        longitude: comm.longitude,
      },
    });
    communeMap.set(comm.code, c.id);
  }

  // 8. Seed Sample Villages (Phums)
  console.log('  → Seeding sample villages in Phsar Chas, Boeng Keng Kang 1...');
  const villages = [
    { code: '12020101', commune_code: '120201', name_km: 'ភូមិ១', name_en: 'Phum 1', slug: 'phum-1', latitude: 11.5714, longitude: 104.9250 },
    { code: '12020102', commune_code: '120201', name_km: 'ភូមិ២', name_en: 'Phum 2', slug: 'phum-2', latitude: 11.5720, longitude: 104.9255 },
    { code: '12020103', commune_code: '120201', name_km: 'ភូមិ៣', name_en: 'Phum 3', slug: 'phum-3', latitude: 11.5710, longitude: 104.9245 },
    { code: '12130101', commune_code: '121301', name_km: 'ភូមិ១', name_en: 'Phum 1', slug: 'bkk1-phum-1', latitude: 11.5528, longitude: 104.9250 },
    { code: '12130102', commune_code: '121301', name_km: 'ភូមិ២', name_en: 'Phum 2', slug: 'bkk1-phum-2', latitude: 11.5535, longitude: 104.9260 },
    { code: '17100101', commune_code: '171001', name_km: 'ភូមិស្លក្រាម', name_en: 'Sla Kram Village', slug: 'sla-kram-village', latitude: 13.3700, longitude: 103.8600 },
  ];

  for (const v of villages) {
    const communeId = communeMap.get(v.commune_code);
    if (!communeId) continue;

    await prisma.village.upsert({
      where: { code: v.code },
      update: {
        name_km: v.name_km,
        name_en: v.name_en,
        slug: v.slug,
        latitude: v.latitude,
        longitude: v.longitude,
      },
      create: {
        code: v.code,
        commune_id: communeId,
        name_km: v.name_km,
        name_en: v.name_en,
        slug: v.slug,
        latitude: v.latitude,
        longitude: v.longitude,
      },
    });
  }

  // 9. Seed Cambodia Postal Codes
  console.log('  → Seeding postal codes...');
  const postalCodes = [
    { postal_code: '12000', province_code: '12', district_code: '1202', commune_code: '120201' },
    { postal_code: '120200', province_code: '12', district_code: '1202', commune_code: '120201' },
    { postal_code: '120100', province_code: '12', district_code: '1201', commune_code: null },
    { postal_code: '121300', province_code: '12', district_code: '1213', commune_code: '121301' },
    { postal_code: '17000', province_code: '17', district_code: '1710', commune_code: '171001' },
    { postal_code: '02000', province_code: '02', district_code: '0203', commune_code: null },
    { postal_code: '07000', province_code: '07', district_code: '0708', commune_code: null },
    { postal_code: '18000', province_code: '18', district_code: null, commune_code: null },
  ];

  for (const pc of postalCodes) {
    const provinceId = provinceMap.get(pc.province_code);
    if (!provinceId) continue;

    const districtId = pc.district_code ? districtMap.get(pc.district_code) || null : null;
    const communeId = pc.commune_code ? communeMap.get(pc.commune_code) || null : null;

    const existing = await prisma.postalCode.findFirst({
      where: { postal_code: pc.postal_code, province_id: provinceId },
    });

    if (!existing) {
      await prisma.postalCode.create({
        data: {
          postal_code: pc.postal_code,
          province_id: provinceId,
          district_id: districtId,
          commune_id: communeId,
        },
      });
    }
  }

  // 10. Seed Official Data Sources Provenance
  console.log('  → Seeding data provenance sources...');
  const dataSources = [
    {
      name: 'Gazetteer of Cambodia Administrative Subdivisions',
      organization: 'National Institute of Statistics (NIS) / Ministry of Planning',
      url: 'https://www.nis.gov.kh',
      license: 'Public Domain / Open Data Cambodia',
      description: 'Official administrative boundary names, geographical classifications, and codes for Cambodia provinces, districts, communes, and villages.',
      last_verified_at: new Date('2026-01-15'),
    },
    {
      name: 'Cambodia Postal Code Reference Directory',
      organization: 'Ministry of Posts and Telecommunications of Cambodia (MPTC)',
      url: 'https://mptc.gov.kh',
      license: 'Government Public Information',
      description: 'Standard 5-digit and 6-digit postal code mappings aligned with provincial and commune administrative areas.',
      last_verified_at: new Date('2026-02-01'),
    },
  ];

  for (const src of dataSources) {
    const existing = await prisma.dataSource.findFirst({ where: { name: src.name } });
    if (!existing) {
      await prisma.dataSource.create({ data: src });
    }
  }

  console.log('✅ Seeding completed successfully!');
  console.log('====================================================');
  console.log('Default Super Admin: admin@khmerapi.dev');
  console.log('Default Password:     KhmerAPI@2026');
  console.log('Demo API Key:         kh_live_demo01... (Hash: c878fb6e7b1655f4625b5a0349b1c53e8d98d02df93627d35368a3068e1abcf5)');
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
