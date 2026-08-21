module.exports = (schema) => (req, res, next) => {
  try {
    console.log("🔐 [VALIDATE] Validating request body:", JSON.stringify(req.body, null, 2));
    
    schema.parse(req.body);
    
    console.log("✅ [VALIDATE] Validation passed");
    next();
  } catch (error) {
    console.error("❌ [VALIDATE] Validation failed:", error.errors);
    
    res.status(400).json({
      message: error.errors,
      details: "Validation error - check your input"
    });
  }
};