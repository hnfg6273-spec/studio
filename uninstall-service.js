const path = require('path');
const { Service } = require('node-windows');

const service = new Service({
  name: 'InsightBoard',
  description: 'The InsightBoard Next.js application.',
  script: path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next'),
});

service.on('uninstall', () => {
  console.log('Service uninstalled.');
});

service.uninstall();
