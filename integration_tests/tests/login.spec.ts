import pkg from 'pactum';
const { spec } = pkg;
import dotenv from 'dotenv';
dotenv.config();

describe('/api/auth/login', () => {
  it('login with valid credentials should give successful response', async () => {
    await spec()
      .post(`${process.env.BASE_URL}/api/auth/login`)
      .withJson({
        username: "admin",
        password: "admin123"
      })
      .expectStatus(200);
  });
});
