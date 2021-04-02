
//renvoie un reseau aleatoire sous forme de json comprehensible par le graph d3
function getJsonRandom() {

    //ponderation des arcs = 1-9
    //nb lien par noeud = 1 à 5
    //nb de noeud pour un réseau = 3 à 20

    var jsonRandom = { "nodes": [], "links": [] };

    jsonRandom.nodes = getArrayNoeuds(jsonRandom.nodes);
    jsonRandom.links = getArrayLinks(jsonRandom.links, jsonRandom.nodes);

    reloadSimulationWithJson(jsonRandom);
}

//recupere le tableau de noeud
function getArrayNoeuds(arrayNoeud) {

    var creeNoeud = true;

    while (creeNoeud) {
        if (arrayNoeud.length < 3) {
            arrayNoeud.push(getUnNoeudAleatoire(arrayNoeud.length + 1));
        }
        else if (arrayNoeud.length >= 3 && arrayNoeud.length < 20) {
            //renvoie de 0 à 2 pour s'avoir si aleatoirement on ajoute encore ou non un noeud 
            //(sachant que de 0 à 2 on laisse une chance sur 3 que cela soit false)
            if (entierAleatoire(0, 2))
                arrayNoeud.push(getUnNoeudAleatoire(arrayNoeud.length + 1));
            else
                creeNoeud = false; // si le nombre aleatoire est à 0, on arrete de créé les réseaux
        }
        else {
            creeNoeud = false;
        }
    }

    return arrayNoeud;
}

//renvoie un noeud créer avec le nbNoeud afin que le nom du noeud soit toujours unique
function getUnNoeudAleatoire(nbNoeud) {
    return { "id": "Noeud " + nbNoeud, "group": nbNoeud };
}

//renvoi un nombre entier aleatoire situé entre le minimum inclus et le maximum inclus passé en parametre 
function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//crée le tableau de lien nécessaire à la création du systeme
function getArrayLinks(arrayLinks, arrayNoeuds) {
    //on fait un clone de l'array pour stocker le nombre de noeud
    var cloneArrayNoeud = getCloneArrayNoeudWithNbLinkAt0(arrayNoeuds);

    //on parcourt chaque noeud pour ajouter les liens entre noeuds
    for (var i = 0; i < arrayNoeuds.length; i++) {

        //on recupere le nombre de link que l'on souhaite créé (aleatoirement) pour ce reseau
        var nbLinkToCreate = entierAleatoire(1, 5);

        //on realise un do while pour s'assurer que chaque noeud contiendra bien au minimum une liaison
        do {

            //pour chacun de ces liens 
            for (var j = 0; j < nbLinkToCreate; j++) {

                //on recupere un nombre aleatoire permettant de pointer le noeud que l'on souhaite (qui est different de celui du noeud actuel)
                var nbNoeudToLink = getEntierAleatoireDifferentDe(i, 0, arrayNoeuds.length - 1);

                //on crée le json de liaison
                var link = {
                    source: arrayNoeuds[i].id,
                    target: arrayNoeuds[nbNoeudToLink].id,
                    distance: entierAleatoire(1, 9) //ponderation des arcs, on genere la distance de 1 à 9
                }

                //on s'assure que les noeuds que l'on va linké n'ont pas trop de liaison (5 max pour chacun) + on s'assure que la liaison n'existe pas deja
                if (cloneArrayNoeud[i].nbLink < 5 && cloneArrayNoeud[nbNoeudToLink].nbLink < 5 && testIfLiaisonExiste(arrayLinks, link)) {

                    //on crée les links
                    arrayLinks.push(link);

                    //on ajoute 1 au nb de link
                    cloneArrayNoeud[i].nbLink++;
                    cloneArrayNoeud[nbNoeudToLink].nbLink++;
                }
            }

        //tant que le noeud n'a pas au moins une liaison, on recommence le process
        }while(!liaisonExistForThisNode(arrayLinks, arrayNoeuds[i]));
    }

    return arrayLinks;
}

//renvoie vrai si au moins une liaison a été trouvé par rapport au noeud passé en parametre
function liaisonExistForThisNode(arrayLinks, node){
    var nom = node.id;

    for(var i = 0; i < arrayLinks.length; i++){
        var link = arrayLinks[i];
        if(link.source == nom || link.target == nom){
            return true;
        }
    }

    return false;
}

//on test si la liaison existe deja ou non dans le code (renvoie true si la liaison n'existe pas)
function testIfLiaisonExiste(arrayLink, link) {

    for (var i = 0; i < arrayLink.length; i++) {
        if ((arrayLink[i].source == link.source && arrayLink[i].target == link.target) ||
            (arrayLink[i].source == link.target && arrayLink[i].target == link.source))
            return false;
    }

    return true;
}

//renvoie un entier aleatoire different de l'entier passé en parametre
function getEntierAleatoireDifferentDe(differentDe, min, max) {
    var different = false;
    var nbAleatoire = null;
    do {

        nbAleatoire = entierAleatoire(min, max);

        if (nbAleatoire != differentDe)
            return nbAleatoire;

    } while (!different);
}

//renvoie un clone du tableau passé en parametre
function getCloneArrayNoeudWithNbLinkAt0(arrayToClone) {

    var arrayToReturn = [];

    for (var i = 0; i < arrayToClone.length; i++) {
        arrayToReturn.push({
            id: arrayToClone[i].id,
            group: arrayToClone[i].group,
            nbLink: 0
        });
    }

    return arrayToReturn;
}
