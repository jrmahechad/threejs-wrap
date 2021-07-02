function getDevicePixelRatio() {
  return Math.min(window.devicePixelRatio, 2);
}

export { getDevicePixelRatio };
