export const hasWebGL = () => { try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false } }
