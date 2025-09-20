// Test script to verify OwnerPage URL parameter handling
console.log("Testing OwnerPage URL parameter functionality...");

// Test URLs that would be generated for email approval
const testEmail = "doctor.ahmed@example.com";
const approveURL = `http://localhost:5173/owner?approve=${encodeURIComponent(testEmail)}`;
const rejectURL = `http://localhost:5173/owner?reject=${encodeURIComponent(testEmail)}`;

console.log("Approve URL:", approveURL);
console.log("Reject URL:", rejectURL);

// Test URL parsing
function testURLParsing(url) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    console.log("\nTesting URL:", url);
    console.log("Path:", urlObj.pathname);
    console.log("Search params:", urlObj.search);
    
    if (params.has('approve')) {
        console.log("Approve email:", params.get('approve'));
        console.log("✅ This URL would trigger approval for:", params.get('approve'));
    } else if (params.has('reject')) {
        console.log("Reject email:", params.get('reject'));
        console.log("❌ This URL would trigger rejection for:", params.get('reject'));
    }
}

testURLParsing(approveURL);
testURLParsing(rejectURL);

console.log("\nTo test the actual OwnerPage functionality:");
console.log("1. Make sure you're logged in as owner");
console.log("2. Visit one of the URLs above");
console.log("3. The OwnerPage should automatically process the request");
console.log("4. Check that the user status is updated accordingly");
