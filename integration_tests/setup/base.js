import pactum from 'pactum';
import dotenv from 'dotenv';
dotenv.config();

const { request } = pactum;

before(() => {
  request.setBaseUrl(process.env.BASE_URL);
});
