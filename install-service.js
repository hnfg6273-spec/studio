const path = require('path');
const { Service } = require('node-windows');

const service = new Service({
  name: 'InsightBoard',
  description: 'The InsightBoard Next.js application.',
  script: path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next'),
  args: ['start', '-p', '9002'],
  nodeOptions: ['--experimental-modules'],
  env: {
    name: 'NODE_ENV',
    value: 'production',
  },
});

service.on('install', () => {
  console.log('Service installed.');
  service.start();
});

service.on('start', () => {
  console.log('Service started.');
});

service.install();
