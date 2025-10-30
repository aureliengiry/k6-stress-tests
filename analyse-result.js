// analyse-k6-result.js
const fs = require('fs');
const readline = require('readline');

// Structure pour stocker les résultats
const results = {
  v1: { durations: [], status: [] },
  v2: { durations: [], status: [] },
};

// Lire le fichier ligne par ligne
const fileStream = fs.createReadStream('test-report.json');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  try {
    const entry = JSON.parse(line);
    if (entry.metric === 'http_req_duration' && (entry.data.tags && entry.data.tags.version)) {
      // Stocker la durée de la requête
      results[entry.data.tags.version].durations.push(entry.data.value);
    }
    if (entry.metric === 'http_req_failed' && (entry.data.tags && entry.data.tags.version)) {
      // Stocker le statut (0 = succès, 1 = échec)
      results[entry.data.tags.version].status.push(entry.data.value === 0 ? '200' : 'error');
    }
  } catch (err) {
    console.error('Erreur de parsing:', err.message, line);
  }
});

rl.on('close', () => {
  // Calculer la moyenne des temps de réponse
  const avgV1 = results.v1.durations.reduce((sum, val) => sum + val, 0) / results.v1.durations.length || 0;
  const avgV2 = results.v2.durations.reduce((sum, val) => sum + val, 0) / results.v2.durations.length || 0;

  // Calculer le taux de succès
  const successV1 = results.v1.status.filter(s => s === '200').length / results.v1.status.length || 0;
  const successV2 = results.v2.status.filter(s => s === '200').length / results.v2.status.length || 0;

  // Afficher le rapport
  console.log('| Version | Temps moyen (ms) | Taux de succès |');
  console.log('|---------|-------------------|----------------|');
  console.log(`| V1      | ${avgV1.toFixed(2)}              | ${(successV1 * 100).toFixed(0)}%       |`);
  console.log(`| V2      | ${avgV2.toFixed(2)}              | ${(successV2 * 100).toFixed(0)}%       |`);
});
