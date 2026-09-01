/**
 * Middleware to validate incoming result check requests
 */
function validateResultRequest(req, res, next) {
  const { roll, registration } = req.body || {};

  if (!roll || typeof roll !== 'string' && typeof roll !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Roll Number is required'
    });
  }

  if (!registration || typeof registration !== 'string' && typeof registration !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Registration Number is required'
    });
  }

  const cleanRoll = String(roll).trim();
  const cleanReg = String(registration).trim();

  if (cleanRoll.length < 3 || cleanRoll.length > 20) {
    return res.status(400).json({
      success: false,
      message: 'Roll Number must be between 3 and 20 digits'
    });
  }

  if (cleanReg.length < 4 || cleanReg.length > 25) {
    return res.status(400).json({
      success: false,
      message: 'Registration Number must be between 4 and 25 digits'
    });
  }

  // Ensure roll and registration contain only valid characters (alphanumeric, hyphens)
  const validPattern = /^[a-zA-Z0-9-]+$/;
  if (!validPattern.test(cleanRoll) || !validPattern.test(cleanReg)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid characters in Roll or Registration Number'
    });
  }

  req.sanitizedInput = {
    roll: cleanRoll,
    registration: cleanReg
  };

  next();
}

module.exports = {
  validateResultRequest
};
