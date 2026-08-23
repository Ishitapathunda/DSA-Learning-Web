import "dotenv/config";
import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 5000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`✅ DSA Learning API listening on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
