const API_VERSION = process.env.API_VERSION ?? '1.0.0';

export const apiInfo = {
  name: 'QR Loyalty System API',
  version: API_VERSION,
  description: 'REST API to manage QR Loyalty System operations.',
  environment: process.env.NODE_ENV ?? 'development',
  endpoints: {
    auth: {
      'POST /auth/login': 'Authenticate user credentials',
      'POST /auth/logout': 'Terminate active session',
      'GET /auth/me': 'Retrieve authenticated user profile',
    },
    customers: {
      'GET /customers': 'List all customers',
      'POST /customers': 'Create new customer',
      'GET /customers/:id': 'Retrieve customer by ID',
      'PUT /customers/:id': 'Update customer information',
      'DELETE /customers/:id': 'Deactivate customer account',
      'GET /customers/:id/qr': 'Generate active QR code for customer',
    },
    transactions: {
      'GET /transactions': 'List all transactions',
      'POST /transactions/earn': 'Record points earned by user',
      'POST /transactions/redeem': 'Redeem points for rewards',
      'POST /transactions/adjust': 'Adjust points balance (ADMIN only)',
    },
    settings: {
      'GET /settings': 'Retrieve business configuration',
      'PATCH /settings': 'Update business settings (ADMIN only)',
    },
    users: {
      'GET /users': 'List all users (ADMIN only)',
      'POST /users': 'Create cashier or admin user (ADMIN only)',
      'DELETE /users/:id': 'Deactivate user account (ADMIN only)',
    },
  },
  docs: process.env.DOCS_URL ?? null,
} as const;