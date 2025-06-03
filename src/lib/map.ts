const getDirections = (address: string) => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
    "_blank",
  );
};
export type MapType = "posbankum" | "obh";
export { getDirections };
