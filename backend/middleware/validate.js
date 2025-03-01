const validate = (schema) => (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        msg: error.errors[0].message // Extract the actual message
      });
    }
  };
  
  module.exports = validate;
  