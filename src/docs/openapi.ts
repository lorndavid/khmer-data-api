export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'KhmerAPI - Free & Open APIs for Cambodian Developers',
    version: '1.0.0',
    description: `
**KhmerAPI** is an open, high-performance REST API platform providing Cambodia-specific public geographic and administrative data.

### Key Features
* 🏛️ **Administrative Hierarchy**: Provinces (ខេត្ត/រាជធានី), Districts (ស្រុក/ខណ្ឌ/ក្រុង), Communes (ឃុំ/សង្កាត់), Villages (ភូមិ).
* 📮 **Postal Code Mapping**: Look up postal codes linked to provinces, districts, and communes.
* 📍 **Full Address Hierarchy**: One-shot lookup of the complete administrative tree via \`/api/v1/locations/{code}\`.
* 🔍 **Multi-Language Search**: Fast bilingual search across English and Khmer names, codes, and slugs with relevance ranking.
* 🗺️ **GeoJSON Endpoints**: Coordinates and FeatureCollections for map integration.
* 📊 **Live Platform Statistics**: Real-time database metrics.
* 🔑 **Developer API Keys & Rate Limiting**: Built-in tiered Redis rate limiting.
* 🛡️ **Role-Based Admin Management**: Full audit-logged CRUD, transactional batch imports, and data exports.

### Authentication
* **Public APIs**: Anonymous access supported by default (60 req/min).
* **Developer Access**: Pass API Key via header \`X-API-Key: kh_live_...\` (300 req/min).
* **Admin Access**: Pass Bearer token via header \`Authorization: Bearer <token>\`.
    `,
    contact: {
      name: 'KhmerAPI Team',
      url: 'https://khmerapi.dev',
      email: 'support@khmerapi.dev',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local Development Server',
    },
    {
      url: 'https://api.khmerapi.dev',
      description: 'Production Gateway',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'Developer API Key (e.g. kh_live_xxxxxxxx)',
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Access Token for authenticated users and admins',
      },
    },
    schemas: {
      ResponseMeta: {
        type: 'object',
        properties: {
          request_id: { type: 'string', example: 'd48d08c0-8fe6-46b5-9f5b-117282b0e77d' },
          timestamp: { type: 'string', format: 'date-time', example: '2026-09-28T12:00:00.000Z' },
        },
        required: ['request_id', 'timestamp'],
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 25 },
          total_pages: { type: 'integer', example: 2 },
          request_id: { type: 'string', example: 'd48d08c0-8fe6-46b5-9f5b-117282b0e77d' },
          timestamp: { type: 'string', format: 'date-time', example: '2026-09-28T12:00:00.000Z' },
        },
        required: ['page', 'limit', 'total', 'total_pages', 'request_id', 'timestamp'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'RESOURCE_NOT_FOUND' },
              message: { type: 'string', example: 'Province not found' },
              details: { type: 'object', nullable: true, example: null },
            },
            required: ['code', 'message'],
          },
          meta: { $ref: '#/components/schemas/ResponseMeta' },
        },
        required: ['success', 'error', 'meta'],
      },
      Province: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '4c7943d0-379e-47f2-8926-7243c9b7e7aa' },
          code: { type: 'string', example: '12' },
          name_km: { type: 'string', example: 'រាជធានីភ្នំពេញ' },
          name_en: { type: 'string', example: 'Phnom Penh' },
          slug: { type: 'string', example: 'phnom-penh' },
          type: { type: 'string', example: 'Municipality' },
          latitude: { type: 'number', example: 11.5564 },
          longitude: { type: 'number', example: 104.9282 },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      District: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'b0ef0bf9-450f-488f-9a0f-d5b7a0d4db02' },
          code: { type: 'string', example: '1202' },
          province_id: { type: 'string', format: 'uuid' },
          name_km: { type: 'string', example: 'ខណ្ឌដូនពេញ' },
          name_en: { type: 'string', example: 'Doun Penh' },
          slug: { type: 'string', example: 'doun-penh' },
          type: { type: 'string', example: 'Khan' },
          latitude: { type: 'number', example: 11.572 },
          longitude: { type: 'number', example: 104.922 },
          is_active: { type: 'boolean', example: true },
        },
      },
      Commune: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          code: { type: 'string', example: '120201' },
          district_id: { type: 'string', format: 'uuid' },
          name_km: { type: 'string', example: 'សង្កាត់ផ្សារចាស់' },
          name_en: { type: 'string', example: 'Phsar Chas' },
          slug: { type: 'string', example: 'phsar-chas' },
          type: { type: 'string', example: 'Sangkat' },
          latitude: { type: 'number', example: 11.571 },
          longitude: { type: 'number', example: 104.925 },
          is_active: { type: 'boolean', example: true },
        },
      },
      Village: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          code: { type: 'string', example: '12020101' },
          commune_id: { type: 'string', format: 'uuid' },
          name_km: { type: 'string', example: 'ភូមិ១' },
          name_en: { type: 'string', example: 'Phum 1' },
          slug: { type: 'string', example: 'phum-1' },
          latitude: { type: 'number', nullable: true },
          longitude: { type: 'number', nullable: true },
          is_active: { type: 'boolean', example: true },
        },
      },
      PostalCode: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          postal_code: { type: 'string', example: '12000' },
          province_id: { type: 'string', format: 'uuid' },
          district_id: { type: 'string', format: 'uuid', nullable: true },
          commune_id: { type: 'string', format: 'uuid', nullable: true },
          is_active: { type: 'boolean', example: true },
        },
      },
      SearchResult: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['province', 'district', 'commune', 'village', 'postal_code'],
            example: 'province',
          },
          id: { type: 'string', format: 'uuid' },
          code: { type: 'string', example: '12' },
          name_km: { type: 'string', example: 'រាជធានីភ្នំពេញ' },
          name_en: { type: 'string', example: 'Phnom Penh' },
          slug: { type: 'string', example: 'phnom-penh' },
          parent_name_en: { type: 'string', example: 'Cambodia' },
          parent_name_km: { type: 'string', example: 'កម្ពុជា' },
          score: { type: 'number', example: 150 },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          service: { type: 'string', example: 'khmerapi-backend' },
          version: { type: 'string', example: '1.0.0' },
          database: { type: 'string', example: 'connected' },
          redis: { type: 'string', example: 'connected' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      StatisticsResponse: {
        type: 'object',
        properties: {
          province_count: { type: 'integer', example: 25 },
          district_count: { type: 'integer', example: 204 },
          commune_count: { type: 'integer', example: 1652 },
          village_count: { type: 'integer', example: 14500 },
          postal_code_count: { type: 'integer', example: 1600 },
          last_data_update: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Service Health Check',
        description: 'Returns connection status of database, redis, and overall service health',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } },
            },
          },
        },
      },
    },
    '/api/v1/provinces': {
      get: {
        summary: 'List Provinces',
        description:
          'Get paginated list of Cambodian provinces with search, filter, and sort capabilities',
        tags: ['Provinces'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search term for name or code',
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', enum: ['code', 'name_en', 'name_km'] },
          },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
          { name: 'active', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          '200': {
            description: 'List of provinces',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Province' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/provinces/{code}': {
      get: {
        summary: 'Get Province by Code or Slug',
        tags: ['Provinces'],
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string' }, example: '12' },
        ],
        responses: {
          '200': { description: 'Province details' },
          '404': {
            description: 'Province not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
    '/api/v1/provinces/{code}/districts': {
      get: {
        summary: 'Get Districts in Province',
        tags: ['Provinces'],
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string' }, example: '12' },
        ],
        responses: {
          '200': { description: 'List of districts in province' },
        },
      },
    },
    '/api/v1/districts': {
      get: {
        summary: 'List Districts',
        tags: ['Districts'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'province_code', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of districts' },
        },
      },
    },
    '/api/v1/districts/{code}': {
      get: {
        summary: 'Get District by Code or Slug',
        tags: ['Districts'],
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string' }, example: '1202' },
        ],
        responses: {
          '200': { description: 'District details' },
        },
      },
    },
    '/api/v1/districts/{code}/communes': {
      get: {
        summary: 'Get Communes in District',
        tags: ['Districts'],
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string' }, example: '1202' },
        ],
        responses: {
          '200': { description: 'List of communes in district' },
        },
      },
    },
    '/api/v1/communes': {
      get: {
        summary: 'List Communes',
        tags: ['Communes'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'district_code', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of communes' },
        },
      },
    },
    '/api/v1/communes/{code}': {
      get: {
        summary: 'Get Commune by Code',
        tags: ['Communes'],
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '120201',
          },
        ],
        responses: {
          '200': { description: 'Commune details' },
        },
      },
    },
    '/api/v1/communes/{code}/villages': {
      get: {
        summary: 'Get Villages in Commune',
        tags: ['Communes'],
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '120201',
          },
        ],
        responses: {
          '200': { description: 'List of villages in commune' },
        },
      },
    },
    '/api/v1/villages': {
      get: {
        summary: 'List Villages',
        tags: ['Villages'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'commune_code', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of villages' },
        },
      },
    },
    '/api/v1/villages/{code}': {
      get: {
        summary: 'Get Village by Code',
        tags: ['Villages'],
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '12020101',
          },
        ],
        responses: {
          '200': { description: 'Village details' },
        },
      },
    },
    '/api/v1/postal-codes': {
      get: {
        summary: 'List Postal Codes',
        tags: ['Postal Codes'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'postal_code', in: 'query', schema: { type: 'string' } },
          { name: 'province_code', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of postal codes' },
        },
      },
    },
    '/api/v1/postal-codes/{postalCode}': {
      get: {
        summary: 'Get Postal Code Information',
        tags: ['Postal Codes'],
        parameters: [
          {
            name: 'postalCode',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '12000',
          },
        ],
        responses: {
          '200': { description: 'Postal code location details' },
        },
      },
    },
    '/api/v1/locations/{code}': {
      get: {
        summary: 'Full Address Hierarchy Lookup',
        description:
          'Looks up the complete administrative hierarchy (province, district, commune, village, postal codes) for any administrative code',
        tags: ['Locations'],
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '120201',
          },
        ],
        responses: {
          '200': { description: 'Complete location hierarchy tree' },
        },
      },
    },
    '/api/v1/search': {
      get: {
        summary: 'Unified Search Across Cambodia',
        description:
          'Searches across provinces, districts, communes, villages, and postal codes in Khmer and English with relevance ranking',
        tags: ['Search'],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'Phnom Penh',
          },
          {
            name: 'type',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['all', 'province', 'district', 'commune', 'village', 'postal_code'],
            },
          },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          '200': {
            description: 'Search results ranked by relevance',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/SearchResult' } },
                    meta: { $ref: '#/components/schemas/ResponseMeta' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/geo/provinces': {
      get: {
        summary: 'GeoJSON Coordinates for Provinces',
        tags: ['Geo'],
        responses: {
          '200': { description: 'GeoJSON FeatureCollection of provinces' },
        },
      },
    },
    '/api/v1/statistics': {
      get: {
        summary: 'Cambodia Geographic Dataset Statistics',
        tags: ['Statistics'],
        responses: {
          '200': {
            description: 'Live counts and update metadata',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/StatisticsResponse' },
                    meta: { $ref: '#/components/schemas/ResponseMeta' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/data-sources': {
      get: {
        summary: 'Data Provenance and Sources',
        tags: ['Data Provenance'],
        responses: {
          '200': { description: 'List of official public data sources and licenses' },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        summary: 'Developer Registration',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email', example: 'developer@example.com' },
                  password: { type: 'string', format: 'password', example: 'KhmerAPI@2026' },
                  first_name: { type: 'string', example: 'Dara' },
                  last_name: { type: 'string', example: 'Sok' },
                },
                required: ['email', 'password', 'first_name', 'last_name'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'User account created and tokens issued' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        summary: 'Developer / Admin Login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email', example: 'developer@example.com' },
                  password: { type: 'string', format: 'password', example: 'KhmerAPI@2026' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Authentication successful, JWT tokens issued' },
        },
      },
    },
    '/api/v1/api-keys': {
      post: {
        summary: 'Generate Developer API Key',
        security: [{ BearerAuth: [] }],
        tags: ['API Keys'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Production Web App' },
                  expires_in_days: { type: 'integer', example: 365 },
                },
                required: ['name'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'API Key generated (raw key shown once)' },
        },
      },
      get: {
        summary: 'List Developer API Keys',
        security: [{ BearerAuth: [] }],
        tags: ['API Keys'],
        responses: {
          '200': { description: 'List of active API keys' },
        },
      },
    },
  },
};
