# k6-stress-tests

Test de [Grafana k6](https://grafana.com/docs/k6/latest/) sur une application php locale.

Le but a été d'effectuer un mini stress test avec cet outils pour comparer les perfs entre un container nginx + php-fpm et un container frankenphp 

## Prérequis

Installer K6 [Doc d'installation](https://grafana.com/docs/k6/latest/set-up/install-k6/)
```
brew install k6
```

## Lancer le test
Il suffit de lancer la commande suivante (ici l'option --insecure-skip-tls-verify permet de by pass la vérification TLS)
```
 k6 run --insecure-skip-tls-verify  --out json=test-report.json test.js
```

Voilà la sortie console quand le test se termine
```

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/

     execution: local
        script: test.js
        output: json (test-report.json)

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 10 looping VUs for 30s (gracefulStop: 30s)



  █ TOTAL RESULTS

    checks_total.......: 72      2.226715/s
    checks_succeeded...: 100.00% 72 out of 72
    checks_failed......: 0.00%   0 out of 72

    ✓ Version 1: Status 200
    ✓ Version 2: Status 200

    HTTP
    http_req_duration..............: avg=1.99s min=146.79ms med=735.45ms max=5.45s  p(90)=4.78s  p(95)=5.35s
      { expected_response:true }...: avg=1.99s min=146.79ms med=735.45ms max=5.45s  p(90)=4.78s  p(95)=5.35s
    http_req_failed................: 0.00%  0 out of 72
    http_reqs......................: 72     2.226715/s

    EXECUTION
    iteration_duration.............: avg=8.68s min=2.37s    med=6.45s    max=17.11s p(90)=17.08s p(95)=17.09s
    iterations.....................: 36     1.113357/s
    vus............................: 2      min=2       max=10
    vus_max........................: 10     min=10      max=10

    NETWORK
    data_received..................: 6.2 MB 191 kB/s
    data_sent......................: 27 kB  835 B/s




running (0m32.3s), 00/10 VUs, 36 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  30s

```


Un fichier avec toutes les stats est généré en sortie `test-report.json`


## Pour visualiser le résumé
```
 node analyse-result.js
```

Voilà le résultat
```
| Version | Temps moyen (ms) | Taux de succès |
|---------|-------------------|----------------|
| V1      | 331.08              | 100%       |
| V2      | 3659.95              | 100%       |
````
