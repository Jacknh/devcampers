const NodeGeocoder = require('node-geocoder');

const PROVIDER = 'opencage';
const API_KEY = 'fc73e5f24e59493393ddf8cf66c88faa'

const geocoder = NodeGeocoder({
  provider: PROVIDER,
  apiKey: API_KEY,
  httpAdapter: 'https',
  formatter: null
})

module.exports = geocoder