import path from 'path';
import { fileURLToPath } from 'url';

const get__dirname = function (moduleUrl) {
  const filename = fileURLToPath(moduleUrl);
  return path.dirname(filename);
};

export { get__dirname };

// const __dirname = get__dirname(import.meta.url);
