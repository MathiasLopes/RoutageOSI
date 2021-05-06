
L'url d'accès au site est : http://routage-osi.mrct.fr:17002/

Si l'url ne fonctionne pas, veuillez installer node sur votre ordinateur : https://nodejs.org/fr/download/
Vous placer dans le dossier des sources (où ce fichier se trouve) avec le terminal
Puis executer les commandes suivante :
npm install
npm start
vous pourrez ensuite accèder en local au site sur l'url : localhost:17002

Mode d'emploi : 
Une fois arrivé sur la page, 3 onglets sont disponible :
- Réseau aléatoire
- Créer mon Réseau
- Parcourir le Réseau

Réseau aléatoire : 
Au départ vous êtes automatiquement placé su l'onglet Réseau aléatoire
Cliquer sur le bouton "Générer un réseau aléatoire" pour en générer un.

Créer mon réseau :
Dans cet onglet, l'espace est divisé en deux : 
- à gauche la liste des neouds existants ainsi qu'un champ texte pour saisir le nom d'un noeud et un bouton permettant de l'ajouter
- à droite, la liste des liaisons existantes et les champs nécessaire à la liaison des neouds
Un bouton "Générer mon réseau" est placé en bas au milieu pour générer le réseau créé

Parcourir le réseau :
Dans cet onglet, il est possible de sélectionné l'algorithme utilisé pour parcourir le réseau ainsi que le noeud de départ et le noeud d'arrivé
Le bouton "Traverser le réseau" permet d'executer le programme en utilisant les parametres sélectionnés
Vous pourrez aperçevoir la traversé en regardant les liaisons s'illuminé en rouge durant une seconde par liaison
