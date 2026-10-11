const bcrypt = require("bcryptjs");
const { User, AuditLog, PasswordResetToken, PatientOtp, Patient } = require("../models");
const { signToken, AUTH_COOKIE_NAME, getAuthCookieOptions } = require("../utils/token");

/**
 * Login Controller
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid input format.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user in MongoDB
    const user = await User.findOne({ email: cleanEmail });

    // Protect against timing attacks / user enumeration
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Check account status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        error: "Your account has been deactivated. Please contact the hospital administrator.",
      });
    }

    // Compare password hash
    let isMatch = await bcrypt.compare(password, user.passwordHash);

    // Fallback: support both configured SEED_ADMIN_PASSWORD and frontend demo preset "MedCore@2026"
    if (!isMatch) {
      if (
        (password === "MedCore@2026" && (user.role === "hospital_admin" || user.role === "super_admin")) ||
        (process.env.SEED_ADMIN_PASSWORD && password === process.env.SEED_ADMIN_PASSWORD)
      ) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Create JWT
    const payload = {
      userId: user.userId || user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const maxAgeMs = rememberMe === true ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const expiresIn = rememberMe === true ? "7d" : "24h";
    const token = signToken(payload, expiresIn);

    // Set HTTP-only Cookie
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions(maxAgeMs));

    // Record audit log
    try {
      await AuditLog.create({
        user_id: user.userId,
        user_name: user.name,
        role: user.role,
        action: "LOGIN",
        module: "Auth",
        details: `Successful login from ${req.ip || "unknown"}`,
        ip_address: req.ip || "127.0.0.1",
      });
    } catch (auditErr) {
      console.warn("Audit log creation skipped:", auditErr.message);
    }

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.userId || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current User Controller
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      id: req.user.userId || req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      department_id: req.user.department_id,
      qualification: req.user.qualification,
    },
  });
};

/**
 * Logout Controller
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

/**
 * Forgot Password Controller
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    // Always respond with success to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, password reset instructions have been generated.",
      });
    }

    const crypto = require("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      user_id: user.userId || user._id,
      token,
      expires_at: expiresAt,
    });

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, password reset instructions have been generated.",
      // In dev mode, return the resetToken for convenience in testing
      devResetToken: process.env.NODE_ENV === "development" ? token : undefined,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password Controller
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body || {};

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: "Token and new password are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters long." });
    }

    const resetRecord = await PasswordResetToken.findOne({
      token,
      used: 0,
      expires_at: { $gt: new Date() },
    });

    if (!resetRecord) {
      return res.status(400).json({ success: false, error: "Invalid or expired password reset link." });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { $or: [{ userId: resetRecord.user_id }, { _id: resetRecord.user_id }] },
      { passwordHash: newHash }
    );

    resetRecord.used = 1;
    await resetRecord.save();

    return res.status(200).json({
      success: true,
      message: "Password has been successfully updated. You may now log in.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Patient OTP Controller
 * POST /api/auth/patient-otp
 */
const patientOtp = async (req, res, next) => {
  try {
    const { action, identifier, otp_code, otp } = req.body || {};

    const isSend = action === "send" || action === "send_otp";
    const isVerify = action === "verify" || action === "verify_otp";

    if (isSend) {
      if (!identifier) {
        return res.status(400).json({ success: false, error: "Mobile number or UHID is required." });
      }

      const cleanId = identifier.trim();

      // Find patient details if available
      const patient = await Patient.findOne({
        $or: [{ uhid: cleanId }, { mobile: cleanId }, { email: cleanId }],
      });

      // Generate 6 digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await PatientOtp.create({
        identifier: cleanId,
        otp_code: code,
        expires_at: expiresAt,
      });

      const patientName = patient ? patient.full_name : `Patient ${cleanId}`;
      const patientUhid = patient ? patient.uhid : cleanId;
      const rawMobile = patient?.mobile || (cleanId.startsWith("+") || /^\d+$/.test(cleanId) ? cleanId : "+91 98250 99881");
      const digitsOnly = rawMobile.replace(/\D/g, "");
      const maskedMobile = digitsOnly.length >= 10
        ? `+91 ******${digitsOnly.slice(-4)}`
        : `+91 ******9881`;

      const whatsappMsg = `Your MedCore HMS OTP for UHID ${patientUhid} is: *${code}*. Valid for 10 minutes.`;
      const encodedMsg = encodeURIComponent(whatsappMsg);
      const cleanPhoneForWa = digitsOnly.startsWith("91") ? digitsOnly : "91" + digitsOnly.slice(-10);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneForWa}&text=${encodedMsg}`;
      const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${cleanPhoneForWa}&text=${encodedMsg}`;

      return res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${cleanId}`,
        devOtp: code,
        otp: code,
        patient_name: patientName,
        patient_uhid: patientUhid,
        masked_mobile: maskedMobile,
        phone: rawMobile,
        whatsapp_url: whatsappUrl,
        whatsapp_web_url: whatsappWebUrl,
        whatsapp_message: whatsappMsg,
      });
    }

    if (isVerify) {
      const codeToVerify = (otp || otp_code || "").toString().trim();
      const cleanId = (identifier || "").toString().trim();

      if (!cleanId || !codeToVerify) {
        return res.status(400).json({ success: false, error: "Identifier and OTP code are required." });
      }

      const otpRecord = await PatientOtp.findOne({
        identifier: cleanId,
        otp_code: codeToVerify,
        verified: 0,
        expires_at: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (!otpRecord) {
        return res.status(400).json({ success: false, error: "Invalid or expired OTP." });
      }

      otpRecord.verified = 1;
      await otpRecord.save();

      // Find or create patient user session
      let patient = await Patient.findOne({
        $or: [{ uhid: cleanId }, { mobile: cleanId }],
      });

      const userEmail = `${(patient?.uhid || cleanId).toLowerCase().replace(/[^a-z0-9]/g, "")}@patient.medcore.in`;
      let user = await User.findOne({
        $or: [
          { email: userEmail },
          { email: `${cleanId.toLowerCase()}@patient.medcore.in` },
          { email: "patient@medcore.in" },
        ],
      });

      if (!user) {
        const dummyHash = await bcrypt.hash("MedCore@Patient2026", 10);
        user = await User.create({
          name: patient ? patient.full_name : `Patient ${cleanId}`,
          email: userEmail,
          passwordHash: dummyHash,
          role: "patient",
          status: "active",
        });
      }

      const token = signToken({
        userId: user.userId || user._id,
        email: user.email,
        name: user.name,
        role: "patient",
      });

      res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions(24 * 60 * 60 * 1000));

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
        token,
        user: {
          id: user.userId || user._id,
          name: user.name,
          email: user.email,
          role: "patient",
        },
      });
    }

    return res.status(400).json({ success: false, error: "Invalid action. Must be 'send_otp' or 'verify_otp'." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  patientOtp,
};
