exports.validateRecord = ({ amount, type, category }) => {
  if (!amount || amount <= 0) {
    return "Amount must be greater than 0";
  }

  if (!['income', 'expense'].includes(type)) {
    return "Invalid type";
  }

  if (!category) {
    return "Category is required";
  }

  return null;
};