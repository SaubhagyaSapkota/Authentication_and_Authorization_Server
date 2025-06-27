const blacklist = new Set();

export function addToBlacklist(token) {
  blacklist.add(token);
}

export function isBlacklisted(token) {
  return blacklist.has(token);
}
