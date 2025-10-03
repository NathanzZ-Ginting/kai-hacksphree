// Test script for schedule endpoint
const testUrl = "http://localhost:3000/api/v1/master-data/schedules/station?origin=2271a260-5fd5-4bd9-adf5-bfa5832f28f1&destination=26cab1de-18be-42ab-b813-eacfe8a00253";

console.log("Testing schedule endpoint:", testUrl);

fetch(testUrl)
  .then(response => {
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    return response.text();
  })
  .then(data => {
    console.log("Response:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });