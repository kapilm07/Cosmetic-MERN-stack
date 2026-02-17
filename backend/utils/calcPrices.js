function addDecimals(num) {
  return Math.round(num).toString();
}

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addDecimals function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

export function calcPrices(orderItems) {
  // Calculate the items price in whole number to avoid issues with
  // floating point number calculations
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.price * item.qty),
    0
  );

  // Calculate the shipping price (Fixed ₹50 for all orders)
  const shippingPrice = 50;

  // Calculate the tax price (GST 18%)
  const taxPrice = 0.18 * itemsPrice;

  // Calculate the total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // return prices as strings
  return {
    itemsPrice: addDecimals(itemsPrice),
    shippingPrice: addDecimals(shippingPrice),
    taxPrice: addDecimals(taxPrice),
    totalPrice: addDecimals(totalPrice),
  };
}
