export function getBackgroundString(url: string) {
  return "url('" + url + "')";
}

export function getBackgroundGradientString(url: string) {
  const test = "url('";
  return test + url + "'), linear-gradient(to bottom, #040026b0, #1b998a4f, #1b998a4e, #fdeff900)";
}
