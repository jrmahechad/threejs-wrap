const sceneDefaults = {
  isFullScreen: false,
  cameraProps: { fov: 75, near: 0.1, far: 1000 },
  useOrbitControls: true,
  trackMouse: false,
  debug: false
};

const events = {
  RESIZE: 'resize',
  CLICK: 'click',
  MOUSEMOVE: 'mousemove'
};

export { sceneDefaults, events };
