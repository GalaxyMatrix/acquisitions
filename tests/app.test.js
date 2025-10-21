import request from 'supertest';
import app from '../src/app.js';

describe('API EndPoints', () => {
  let server;

  // Close server after all tests
  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
    // Give time for cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return api message', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Acquisitions Service API is running!');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});