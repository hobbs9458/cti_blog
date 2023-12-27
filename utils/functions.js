export function capitalize(name, splitChar) {
  const arr = name.split(`${splitChar}`);
  return arr.map((name) => name[0].toUpperCase() + name.slice(1)).join(" ");
}
