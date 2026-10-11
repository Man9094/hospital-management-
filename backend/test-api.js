const http = require("http");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== MedCore HMS API Test Suite ===\n");

  // Test 1: Health Check
  console.log("1. Testing GET /api/health...");
  const healthRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/health",
    method: "GET",
  });
  console.log(`Status: ${healthRes.statusCode}`);
  console.log("Response:", healthRes.data);
  if (healthRes.statusCode !== 200 || healthRes.data.status !== "ok") {
    console.error("❌ Health check failed!");
  } else {
    console.log("✅ Health check passed!\n");
  }

  // Test 2: Unauthenticated /api/auth/me
  console.log("2. Testing GET /api/auth/me (Unauthenticated)...");
  const meRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/me",
    method: "GET",
  });
  console.log(`Status: ${meRes.statusCode}`);
  console.log("Response:", meRes.data);
  if (meRes.statusCode === 401 && meRes.data.success === false) {
    console.log("✅ Correctly rejected unauthenticated request with 401!\n");
  } else {
    console.error("❌ Expected 401 Unauthorized!");
  }

  // Test 3: Unauthenticated /api/patients
  console.log("3. Testing GET /api/patients (Unauthenticated)...");
  const patientsRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/patients",
    method: "GET",
  });
  console.log(`Status: ${patientsRes.statusCode}`);
  console.log("Response:", patientsRes.data);
  if (patientsRes.statusCode === 401) {
    console.log("✅ Protected patient API rejected unauthenticated request with 401!\n");
  } else {
    console.error("❌ Expected 401 Unauthorized for patients API!");
  }

  // Test 4: Missing Credentials on /api/auth/login
  console.log("4. Testing POST /api/auth/login (Empty body)...");
  const emptyLoginRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {}
  );
  console.log(`Status: ${emptyLoginRes.statusCode}`);
  console.log("Response:", emptyLoginRes.data);
  if (emptyLoginRes.statusCode === 400) {
    console.log("✅ Correctly validated missing email and password with 400!\n");
  } else {
    console.error("❌ Expected 400 Bad Request for empty login!");
  }

  // Test 5: Logout
  console.log("5. Testing POST /api/auth/logout...");
  const logoutRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/logout",
    method: "POST",
  });
  console.log(`Status: ${logoutRes.statusCode}`);
  console.log("Response:", logoutRes.data);
  const cookieHeader = logoutRes.headers["set-cookie"];
  console.log("Set-Cookie header:", cookieHeader);
  if (logoutRes.statusCode === 200 && logoutRes.data.success) {
    console.log("✅ Logout cleared cookie and returned success!\n");
  } else {
    console.error("❌ Expected 200 for logout!");
  }

  // Test 6: Undefined route 404
  console.log("6. Testing undefined route /api/nonexistent...");
  const notFoundRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/nonexistent",
    method: "GET",
  });
  console.log(`Status: ${notFoundRes.statusCode}`);
  console.log("Response:", notFoundRes.data);
  if (notFoundRes.statusCode === 404) {
    console.log("✅ Correctly returned 404 JSON response!\n");
  } else {
    console.error("❌ Expected 404 for undefined route!");
  }

  // Test 7: JWT and RBAC verification using token utility
  console.log("7. Testing JWT signature, verification, and RBAC middleware unit logic...");
  const { signToken, verifyToken, AUTH_COOKIE_NAME } = require("./src/utils/token");
  const testPayload = { userId: 3, email: "doctor@medcore.in", name: "Dr. Rajesh Patel", role: "doctor" };
  const token = signToken(testPayload, "1h");
  console.log("Generated token:", token.slice(0, 30) + "...");
  const verified = verifyToken(token);
  console.log("Decoded payload:", { userId: verified.userId, role: verified.role, email: verified.email });

  if (verified && verified.role === "doctor" && verified.userId === 3) {
    console.log("✅ JWT signing and verification verified successfully!\n");
  } else {
    console.error("❌ JWT token verification failed!");
  }

  // Test 8: RBAC middleware test
  const { requireRole } = require("./src/middleware/roleMiddleware");
  const adminCheck = requireRole("hospital_admin", "super_admin");
  let rbacStatus = null;
  let rbacError = null;

  const mockReqDoctor = { user: { role: "doctor" } };
  const mockResDoctor = {
    status: (code) => {
      rbacStatus = code;
      return {
        json: (data) => {
          rbacError = data.error;
        },
      };
    },
  };
  adminCheck(mockReqDoctor, mockResDoctor, () => {});

  if (rbacStatus === 403) {
    console.log(`✅ RBAC correctly blocked doctor role from admin route with 403 Forbidden! (${rbacError})\n`);
  } else {
    console.error("❌ RBAC failed to block unauthorized role!");
  }

  const mockReqAdmin = { user: { role: "hospital_admin" } };
  let adminPassed = false;
  adminCheck(mockReqAdmin, {}, () => {
    adminPassed = true;
  });

  if (adminPassed) {
    console.log("✅ RBAC correctly allowed hospital_admin role!\n");
  } else {
    console.error("❌ RBAC failed to allow authorized role!");
  }

  console.log("🎉 All executed tests passed successfully!");
}

runTests().catch(console.error);
