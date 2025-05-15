// src/utils/cartUtils.js

export function applySchemeDiscountToInvoice(invoiceList, buyer, includeGST = false) {
  const schemeParts = (buyer?.scheme || "0+0").split("+");
  const dis = parseFloat(buyer?.discount || 0);

  return invoiceList.map((item) => {
    const totalGroupSize = schemeParts.length === 2 ? (parseInt(schemeParts[0]) + parseInt(schemeParts[1])) : 1;
    const chargeablePerGroup = schemeParts.length === 2 ? parseInt(schemeParts[0]) : parseInt(item.qty);
    const fullGroups = Math.floor(parseInt(item.qty) / totalGroupSize);
    const remainder = parseInt(item.qty) % totalGroupSize;
    const effectivePaidQty = (fullGroups * chargeablePerGroup) + remainder;

    const grossAmount = parseFloat(item.rate) * effectivePaidQty;
    const discountedAmount = grossAmount * (1 - dis / 100);
    const gstRate = parseFloat(item.gst || 0);
    const gstAmount = includeGST ? (discountedAmount * gstRate / 100) : 0;
    const finalAmount = discountedAmount + gstAmount;

    return {
      ...item,
      scheme: buyer.scheme || "0+0",
      discount: dis,
      amount: finalAmount,
      gstAmount: gstAmount
    };
  });
}
