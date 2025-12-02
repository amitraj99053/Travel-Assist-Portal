// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate phone format
const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

// Generate unique invoice number
const generateInvoiceNumber = () => {
  return 'INV-' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Generate unique transaction ID
const generateTransactionId = () => {
  return 'TXN-' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

module.exports = {
  isValidEmail,
  isValidPhone,
  generateInvoiceNumber,
  generateTransactionId,
};
