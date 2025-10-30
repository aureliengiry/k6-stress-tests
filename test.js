import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuration de base
export const options = {
  vus: 10, // Nombre d'utilisateurs virtuels
  duration: '30s', // Durée du test
};

// URL des deux versions à comparer
const version1 = 'https://www.aml87.local/fr/blog';
const version2 = 'https://www.aml87_frankenphp.local/fr/blog';

export default function () {
  // Test de la version 1
  let res1 = http.get(version1, { tags: { version: 'v1' } });

  check(res1, {
    'Version 1: Status 200': (r) => r.status === 200,
  });
  sleep(1); // Pause pour simuler un utilisateur réel

  // Test de la version 2
  let res2 = http.get(version2, { tags: { version: 'v2' } });
  check(res2, {
    'Version 2: Status 200': (r) => r.status === 200,
  });
  sleep(1);
}
