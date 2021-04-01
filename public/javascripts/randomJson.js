
var nbNoeuds = 5;
var nbNoeudFixed = false;

function getJsonRandom() {

    //ponderation des arcs = 1-9
    //nb lien par noeud = 1 à 5
    //nb de noeud pour un réseau = 3 à 20

    //recuperation des options sélectionné par l'utilisateur
    getParametreJsonRandomByUser();

    var jsonRandom = { "nodes": [], "links": [] };

    jsonRandom.nodes = getArrayNoeuds(jsonRandom.nodes);
    jsonRandom.links = getArrayLinks(jsonRandom.links, jsonRandom.nodes);

    reloadSimulationWithJson(jsonRandom);
}

function getParametreJsonRandomByUser() {
    nbNoeudFixed = $("#activeNombreNoeudDefinie").is(":checked");

    if (nbNoeudFixed) {
        nbNoeuds = parseInt($("#nbNoeudAleatoire").val());
    }
}

function getArrayNoeuds(arrayNoeud) {

    var creeNoeud = true;

    while (creeNoeud) {
        if (arrayNoeud.length < 3) {
            arrayNoeud.push(getUnNoeudAleatoire(arrayNoeud.length + 1));
        }
        else if (arrayNoeud.length >= 3 && arrayNoeud.length < 20) {
            if ((nbNoeudFixed && arrayNoeud.length < nbNoeuds) || (!nbNoeudFixed && entierAleatoire(0, 1)))
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

function getUnNoeudAleatoire(nbNoeud) {
    return { "id": "Noeud " + nbNoeud, "group": nbNoeud };
}

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

        //pour chacun de ces liens 
        for (var j = 0; j < nbLinkToCreate; j++) {
            //on recupere un nombre aleatoire permettant de pointer le noeud que l'on souhaite (qui est different de celui du noeud actuel)
            var nbNoeudToLink = getEntierAleatoireDifferentDe(i, 0, arrayNoeuds.length - 1);

            //on crée le json de liaison
            var link = {
                source: arrayNoeuds[i].id,
                target: arrayNoeuds[nbNoeudToLink].id,
                distance: entierAleatoire(1, 9) //ponderation des arcs
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
    }

    return arrayLinks;
}

//on test si la liaison existe deja ou non dans le code
function testIfLiaisonExiste(arrayLink, link) {

    for (var i = 0; i < arrayLink.length; i++) {
        if ((arrayLink[i].source == link.source && arrayLink[i].target == link.target) ||
            (arrayLink[i].source == link.target && arrayLink[i].target == link.source))
            return false;
    }

    return true;
}

function getEntierAleatoireDifferentDe(differentDe, min, max) {
    var different = false;
    var nbAleatoire = null;
    do {

        nbAleatoire = entierAleatoire(min, max);

        if (nbAleatoire != differentDe)
            return nbAleatoire;

    } while (!different);
}

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

function calculPonderationDesArcs(json){

    var ponderation = -1;

    //on recupere le nombre de noeud ayant x liaisons puis on calcule la pondération
    var jsonForPonderation = getNbLienForNoeuds(json);
    
    //calcule de la ponderation
    ponderation = (
                    (1*jsonForPonderation.noeudWith1Lien)+
                    (2*jsonForPonderation.noeudWith2Lien)+
                    (3*jsonForPonderation.noeudWith3Lien)+
                    (4*jsonForPonderation.noeudWith4Lien)+
                    (5*jsonForPonderation.noeudWith5Lien)
                  )/(jsonForPonderation.noeudWith1Lien +
                     jsonForPonderation.noeudWith2Lien +
                     jsonForPonderation.noeudWith3Lien +
                     jsonForPonderation.noeudWith4Lien +
                     jsonForPonderation.noeudWith5Lien);

    console.log("ponderation : " + ponderation);

    //si le calcul de pondération est plus petit que 1 ou plus grand que 9 on renvoie false
    return (ponderation >= 1 && ponderation <= 9);

}

function getNbLienForNoeuds(json){

    var jsonForPonderation = {
        noeudWith1Lien: 0,
        noeudWith2Lien: 0,
        noeudWith3Lien: 0,
        noeudWith4Lien: 0,
        noeudWith5Lien: 0
    }

    //pour chaque noeud on va compter son nombre de liaison
    for(var i = 0; i < json.nodes.length; i++){

        var node = json.nodes[i];
        var nbLiens = 0;

        for(var j = 0; j < json.links.length; j++){

            var link = json.links[j];

            if(link.source == node.id || link.target == node.id)
                nbLiens++;
        }

        //en fonction du nb de lien, on ajoute 1 dans le bon champ
        switch(nbLiens){
            case 1:
                jsonForPonderation.noeudWith1Lien++;
                break;
            case 2:
                jsonForPonderation.noeudWith2Lien++;
                break;
            case 3:
                jsonForPonderation.noeudWith3Lien++;
                break;
            case 4:
                jsonForPonderation.noeudWith4Lien++;
                break;
            case 5:
                jsonForPonderation.noeudWith5Lien++;
                break;
            default:
                break;
        }

    }

    return jsonForPonderation;

}