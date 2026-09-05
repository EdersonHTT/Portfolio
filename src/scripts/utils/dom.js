
export function qs(selector, ctx = document) {
  return ctx.querySelector(selector);
}

export function qsa(selector, ctx = document) {
  return Array.from(ctx.querySelectorAll(selector));
}
