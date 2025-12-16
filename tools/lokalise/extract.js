/* eslint-disable no-undef */
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import LokaliseExtractor from '@qumu/lokalise-extractor';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

config({
  path: `${__dirname}/.env`,
});

const apiKey = process.argv[2] || process.env.LOKALISE_API_KEY;
const projectId = process.argv[3] || process.env.LOKALISE_PROJECT_ID;

new LokaliseExtractor(
  apiKey,
  projectId,
  join(__dirname, '../../')
)
  .extractPoToJSON()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Done!');
  });
