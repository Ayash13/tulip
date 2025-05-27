import { testConnection, closePool } from "./lib/db"; // Adjust path if necessary

async function main() {
  console.log("Attempting to test database connection...");
  let success = false;
  try {
    success = await testConnection();
    if (success) {
      console.log("Database connection test SUCCEEDED.");
    } else {
      console.log("Database connection test FAILED (testConnection returned false).");
    }
  } catch (error) {
    console.error("Database connection test FAILED with error:", error);
  } finally {
    await closePool(); // Ensure the pool is closed after the test
    console.log("Database pool closed.");
  }
}

main();
