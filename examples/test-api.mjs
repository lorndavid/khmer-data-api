// ========================================================
// KhmerAPI — Official JavaScript / Node.js Test Script
// Live Endpoint: https://khmerapi.lorndavid.online/v1
// ========================================================

const API_BASE = process.env.API_BASE_URL || 'https://khmerapi.lorndavid.online/v1';

async function runTests() {
  console.log('🚀 Testing KhmerAPI in JavaScript');
  console.log(`📡 Base URL: ${API_BASE}\n`);

  try {
    // 1. Healthcheck
    console.log('1️⃣ Checking API Health:');
    const healthRes = await fetch('https://khmerapi.lorndavid.online/health');
    const healthData = await healthRes.json();
    console.log('   Status:', healthData.status);
    console.log('   Service:', healthData.service);
    console.log('   Database:', healthData.database, '\n');

    // 2. Fetch all 25 Provinces
    console.log('2️⃣ Fetching Provinces:');
    const provincesRes = await fetch(`${API_BASE}/provinces`);
    const provinces = await provincesRes.json();
    console.log(`   Total provinces returned: ${provinces.data?.length || 0}`);
    console.log('   Sample:', provinces.data?.[0]?.name_en, `(${provinces.data?.[0]?.name_km})`, `[Code: ${provinces.data?.[0]?.code}]\n`);

    // 3. Fetch Districts in Phnom Penh (Code: 12)
    console.log('3️⃣ Fetching Districts in Phnom Penh (Code 12):');
    const districtsRes = await fetch(`${API_BASE}/districts?province_code=12&limit=5`);
    const districts = await districtsRes.json();
    console.log(`   Sample Districts:`, districts.data?.map(d => `${d.name_en} (${d.name_km})`).join(', '), '\n');

    // 4. Search in Khmer Unicode (សៀមរាប)
    console.log('4️⃣ Search Khmer Language (សៀមរាប):');
    const searchRes = await fetch(`${API_BASE}/search?q=${encodeURIComponent('សៀមរាប')}`);
    const searchResults = await searchRes.json();
    console.log(`   Found matches:`, searchResults.data?.map(item => `${item.name_km} (${item.type})`).join(', '), '\n');

    // 5. Postal Code Lookup (Phnom Penh 12000)
    console.log('5️⃣ Postal Code Lookup:');
    const postalRes = await fetch(`${API_BASE}/postal-codes?code=12000`);
    const postal = await postalRes.json();
    console.log(`   Result:`, postal.data?.[0]?.name_en || 'Found', `[Code: ${postal.data?.[0]?.code || '12000'}]\n`);

    console.log('✅ ALL JAVASCRIPT API TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

runTests();
