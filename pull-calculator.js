"use strict";
const form = document.getElementById("pull-calculator");
const result = document.getElementById("pull-result");
// Decimal inputs are converted to fractions so an exact whole result is not over-rounded by binary floating point.
function fraction(value) {
  const match = /^(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i.exec(value.toString());
  const decimals = match[2] || "";
  const scale = decimals.length - Number(match[3] || 0);
  const numerator = BigInt(match[1] + decimals);
  return scale <= 0 ? [numerator * 10n ** BigInt(-scale), 1n] : [numerator, 10n ** BigInt(scale)];
}
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const quantity = Number(form.elements.quantity.value);
  const arrangements = Number(form.elements.arrangements.value);
  const allowance = Number(form.elements.allowance.value);
  if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 10000 || !Number.isSafeInteger(arrangements) || arrangements < 1 || arrangements > 10000 || !Number.isFinite(allowance) || allowance < 0 || allowance > 1000) {
    result.textContent = "Enter a quantity above zero, 1–10,000 whole arrangements, and an allowance between 0 and 1,000%.";
    return;
  }
  const [q, qd] = fraction(quantity);
  const [w, wd] = fraction(allowance);
  const numerator = q * BigInt(arrangements) * (100n * wd + w);
  const denominator = qd * wd * 100n;
  const total = (numerator + denominator - 1n) / denominator;
  result.textContent = `${total.toLocaleString()} units — ${quantity} × ${arrangements} with a ${allowance}% allowance, rounded up.`;
});
