# Snow

Des flocons légers, à des profondeurs différentes. Une chute lente et silencieuse.

Une responsabilité : snow. Pas de réseau, de données utilisateur, d'accès natif ou de service privé du cœur. Les réglages sont définis dans le manifeste.

Le rendu est limité à 30 images par seconde et à un ratio de pixels de 2. Il s'arrête lorsque le document est masqué, que le calque est hors champ, que l'animation est désactivée ou que la préférence système demande de réduire les mouvements. Le mode vignette produit une image fixe. Les observateurs et animations sont libérés à la destruction du calque.

Installez Node.js et pnpm. Exécutez `pnpm install`, `pnpm build`, `pnpm test`, puis `mywallpaper dev` avec le CLI installé. Appairez le lien privé dans les paramètres développeur de MyWallpaper. Aucun watcher Vite secondaire n'est nécessaire.

Après `mywallpaper check`, publiez un dépôt public distinct et un tag immuable correspondant à la version du manifeste, puis choisissez ce tag dans MyWallpaper pour la publication centrale.

Code et ressources originales sous licence MIT.
