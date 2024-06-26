//json de base du réseau manuel
var jsonReseauManual = { "nodes": [], "links": [] };

//permet de remettre à zero le json de réseau manuel
function clearJsonReseauManual() {
    jsonReseauManual = getJsonToClearJsonReseau();
}

//renvoi un json au format réseau manuel vide
function getJsonToClearJsonReseau() {
    return { "nodes": [], "links": [] };
}

//ajoute un noeud dans la liste des noeuds du reseau de l'utilisateur
function addNoeudToList() {

    var noeud = $("#noeudToAdd").val();

    if (noeud != "") {

        //on verifie que le nom du noeud n'existe pas deja
        if (!getNoeudAlreaydExist(jsonReseauManual.nodes, noeud)) {
            //on ajoute le noeud dans le systeme (avec le group 0 pour le moment parce qu'on en a pas l'utilité)
            jsonReseauManual.nodes.push({ id: noeud, group: 0 });

            //on ajoute le noeud dans l'html
            addNoeudToListeHtml(noeud);
            refreshListeNoeudForLiaisonOption();

        } else {
            alert("Un noeud avec ce nom existe déjà");
        }
    } else {
        alert("Le noeud n'a pas de nom");
    }
}

//ajoute un noeud dans la liste html des noeuds du reseau de l'utilisateur
function addNoeudToListeHtml(nom) {
    $(".listenoeuds").prepend("<div class='unNoeud' data-name='" + nom + "'><div class='text_unNoeud'>" + nom + "</div><span class='removeElement' onclick='removeNoeudMe(\"" + nom + "\");'>X</span></div>");
}

//supprime le noeud ayant le nom passé en parametre
function removeNoeudMe(nom) {

    var noeudSupprimer = false;
    for (var i = 0; i < jsonReseauManual.nodes.length; i++) {
        if (jsonReseauManual.nodes[i].id == nom) {
            //on efface le noeud du json
            jsonReseauManual.nodes.splice(i, 1);

            //on efface le noeud de l'html
            $(".listenoeuds").find("[data-name='" + nom + "']").remove();

            noeudSupprimer = true;

            break;
        }
    }

    //on met à jour la liste des liaisons en effacant les liaisons contenant le noeud effacé
    jsonReseauManual = removeLiaisonWithNoeudRemoved(nom, jsonReseauManual);

    //on rafraichit les listes de noeuds pour créer des liaisons
    refreshListeNoeudForLiaisonOption();
    //on rafraichit la liste des liaisons
    reloadListeLinksForReseauManual();

    if (!noeudSupprimer)
        alert("Le noeud que vous essayer de supprimer n'existe pas");

}

//renvoie true ou false si le noeud passé en parametre existe ou non dans le json de noeud passé en parametre
function getNoeudAlreaydExist(jsonNoeud, nom) {
    for (var i = 0; i < jsonNoeud.length; i++) {
        if (jsonNoeud[i].id == nom)
            return true;
    }
    return false;
}

//recharge les choix des neouds dans les listes de choix possible
function refreshListeNoeudForLiaisonOption() {

    $("#selectNoeud1").html('<option value="">Choix 1</option>');
    $("#selectNoeud2").html('<option value="">Choix 2</option>');

    var htmlToAdd = "";
    for (var i = 0; i < jsonReseauManual.nodes.length; i++) {
        var element = jsonReseauManual.nodes[i];
        htmlToAdd += '<option value="' + element.id + '">' + element.id + '</option>';
    }

    $("#selectNoeud1").append(htmlToAdd);
    $("#selectNoeud2").append(htmlToAdd);

}

//ajoute une liaison dans la liste de liaison de l'utilisateur
function addLiaisonToList() {

    var choix1 = $("#selectNoeud1").val();
    var choix2 = $("#selectNoeud2").val();
    var distance = parseInt($("#inputDistanceForLiaison").val());

    if (distance >= 1 && distance <= 9) {
        if (choix1 != "" && choix2 != "") {
            if (choix1 != choix2) {

                var link = {
                    source: choix1,
                    target: choix2,
                    distance: distance
                }

                //si la laison n'existe pas deja
                if (!testIfLiaisonExisteV2(jsonReseauManual.links, link)) {

                    //on ajoute la liaison dans le json
                    jsonReseauManual.links.push(link);

                    //on ajoute la liaison dans le code html
                    addLinksToListeHtml(link);

                } else {
                    alert("La liaison que vous souhaitez ajouter existe deja");
                }

            } else {
                alert("Vous ne pouvez pas créer une liaison avec le même noeud");
            }
        } else {
            alert("Vous devez sélectionné un noeud dans les deux listes pour créer une liaison");
        }
    }
    else {
        alert("La distance est invalide (doit se situer entre 1 et 9)");
    }

}

//recharge la liste html des liaisons de l'utilisateur
function reloadListeLinksForReseauManual() {

    $(".listeliaisons").html("");

    for (var i = 0; i < jsonReseauManual.links.length; i++) {
        addLinksToListeHtml(jsonReseauManual.links[i]);
    }

}

//renvoie true ou false si la liaison passé en parametre existe ou non dans le json de liaison passé en parametre
function testIfLiaisonExisteV2(arrayLink, link) {

    for (var i = 0; i < arrayLink.length; i++) {
        if (((arrayLink[i].source == link.source && arrayLink[i].target == link.target) ||
            (arrayLink[i].source == link.target && arrayLink[i].target == link.source)) ||
            ((arrayLink[i].source.id == link.source && arrayLink[i].target.id == link.target) ||
                (arrayLink[i].source.id == link.target && arrayLink[i].target.id == link.source)))
            return true;
    }

    return false;

}

//ajoute la liaison passé en parametre dans la liste html des liaisons de l'utilisateur
function addLinksToListeHtml(link) {
    $(".listeliaisons").prepend("<div class='unLink' data-sourcetarget='" + link.source + link.target + "'><div class='text_unLink'>" + link.source + " <-> " + link.target + " (distance : " + link.distance + ")</div><span class='removeElement' onclick='removeLinkMe(\"" + link.source + link.target + "\", \"" + link.source + "\", \"" + link.target + "\");'>X</span></div>");
}

//supprime une liaison
function removeLinkMe(sourcetarget, source, target) {

    var linkSupprimer = false;
    for (var i = 0; i < jsonReseauManual.links.length; i++) {

        if ((jsonReseauManual.links[i].source == source && jsonReseauManual.links[i].target == target) ||
            (jsonReseauManual.links[i].source.id == source && jsonReseauManual.links[i].target.id == target)) {
            //on efface le noeud du json
            jsonReseauManual.links.splice(i, 1);

            //on efface le noeud de l'html
            $(".listeliaisons").find("[data-sourcetarget='" + sourcetarget + "']").remove();

            linkSupprimer = true;

            break;
        }
    }

    if (!linkSupprimer)
        alert("La liaison que vous essayer de supprimer n'existe pas");

}

//methode qui permet de recharger le graph avec le nouveau json du ReseauManual
function generateMyReseauManual() {
    reloadSimulationWithJson(cloneArrayObjectForReseauSchema(jsonReseauManual));
}

//permet de clonner un json pour les reseaux (noeud, link)
function cloneArrayObjectForReseauSchema(jsonToClone) {

    var arrayToReturn = getJsonToClearJsonReseau();

    for (var i = 0; i < jsonToClone.nodes.length; i++) {
        arrayToReturn.nodes.push({
            id: jsonToClone.nodes[i].id
        });
    }

    for (var i = 0; i < jsonToClone.links.length; i++) {
        arrayToReturn.links.push({
            source: jsonToClone.links[i].source,
            target: jsonToClone.links[i].target,
            distance: jsonToClone.links[i].distance
        });
    }

    return arrayToReturn;

}

//permet d'enlever toutes les liaisons d'un json contenant le neoud passé en parametre
function removeLiaisonWithNoeudRemoved(noeudRemoved, jsonToRemoveLiaison) {

    var jsonWithLinksRemoved = [];

    for (var i = 0; i < jsonToRemoveLiaison.links.length; i++) {

        var link = jsonToRemoveLiaison.links[i];

        if (!(link.source == noeudRemoved || link.target == noeudRemoved))
            jsonWithLinksRemoved.push(link);
    }

    jsonToRemoveLiaison.links = jsonWithLinksRemoved;
    return jsonToRemoveLiaison;
}