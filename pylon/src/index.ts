import app from './app';
import dotenv from "dotenv";
// dotenv.config({ path: './.env' });

const port = process.env.port || 5000;
const host = process.env.host || "localhost";

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://${host}:${port}`);
  /* eslint-enable no-console */
});
