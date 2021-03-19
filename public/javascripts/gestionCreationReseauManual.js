
var jsonReseauManual =  {"nodes": [],"links": []};

function clearJsonReseauManual(){
    jsonReseauManual = getJsonToClearJsonReseau();
}

function getJsonToClearJsonReseau(){
    return {"nodes": [],"links": []};
}

function addNoeudToList(){

    var noeud = $("#noeudToAdd").val();

    if(noeud != ""){

        //on verifie que le nom du noeud n'existe pas deja
        if(!getNoeudAlreaydExist(jsonReseauManual.nodes, noeud))
        {
            //on ajoute le noeud dans le systeme (avec le group 0 pour le moment parce qu'on en a pas l'utilité)
            jsonReseauManual.nodes.push({id: noeud, group:0});

            //on ajoute le noeud dans l'html
            addNoeudToListeHtml(noeud);
            refreshListeNoeudForLiaisonOption();

        }else{
            alert("Un noeud avec ce nom existe déjà");
        }
    }else{
        alert("Le noeud n'a pas de nom");
    }
}

function addNoeudToListeHtml(nom){
    $(".listenoeuds").append("<div class='unNoeud' data-name='" + nom + "'>" + nom + "<span class='removeElement' onclick='removeNoeudMe(\"" + nom + "\");'>X</span></div>");
}

function removeNoeudMe(nom){

    var noeudSupprimer = false;
    for(var i = 0; i < jsonReseauManual.nodes.length; i++)
    {
        if(jsonReseauManual.nodes[i].id == nom){
            //on efface le noeud du json
            jsonReseauManual.nodes.splice(i, 1);

            //on efface le noeud de l'html
            $(".listenoeuds").find("[data-name='" + nom + "']").remove();

            noeudSupprimer = true;

            break;
        }
    }

    refreshListeNoeudForLiaisonOption();

    if(!noeudSupprimer)
        alert("Le noeud que vous essayer de supprimer n'existe pas");

}

function getNoeudAlreaydExist(jsonNoeud, nom){
    for(var i = 0; i < jsonNoeud.length; i++)
    {
        if(jsonNoeud[i].id == nom)
            return true;
    }
    return false;
}

function refreshListeNoeudForLiaisonOption(){
    
    $("#selectNoeud1").html('<option value="">Choix 1</option>');
    $("#selectNoeud2").html('<option value="">Choix 2</option>');

    var htmlToAdd = "";
    for(var i = 0; i < jsonReseauManual.nodes.length; i++){
        var element = jsonReseauManual.nodes[i];
        htmlToAdd += '<option value="' + element.id + '">' + element.id + '</option>';
    }

    $("#selectNoeud1").append(htmlToAdd);
    $("#selectNoeud2").append(htmlToAdd);

}

function addLiaisonToList(){

    var choix1 = $("#selectNoeud1").val();
    var choix2 = $("#selectNoeud2").val();

    if(choix1 != "" && choix2 != ""){    
        if(choix1 != choix2){

            var link = {
                source: choix1,
                target: choix2
            }

            //si la laison n'existe pas deja
            if(!testIfLiaisonExisteV2(jsonReseauManual.links, link)){

                //on ajoute la liaison dans le json
                jsonReseauManual.links.push(link);

                //on ajoute la liaison dans le code html
                addLinksToListeHtml(link);

            }else{
                alert("La liaison que vous souhaité ajouter existe deja");
            }

        }else{
            alert("Vous ne pouvez pas choisir le même point pour faire une liaison");
        }
    }else{
        alert("Vous devez sélectionné un noeud dans les deux listes pour créer une liaison");
    }

}

function testIfLiaisonExisteV2(arrayLink, link){


    for(var i = 0; i < arrayLink.length; i++)
    {
        if(((arrayLink[i].source == link.source && arrayLink[i].target == link.target) ||
            (arrayLink[i].source == link.target && arrayLink[i].target == link.source)) || 
            ((arrayLink[i].source.id == link.source && arrayLink[i].target.id == link.target) || 
            (arrayLink[i].source.id == link.target && arrayLink[i].target.id == link.source)))
            return true;
    }

    return false;

}

function addLinksToListeHtml(link){
    $(".listeliaisons").append("<div class='unLink' data-sourcetarget='" + link.source + link.target + "'>" + link.source + " <-> " + link.target + "<span class='removeElement' onclick='removeLinkMe(\"" + link.source + link.target + "\", \"" + link.source + "\", \"" + link.target + "\");'>X</span></div>");
}

function removeLinkMe(sourcetarget, source, target){

    var linkSupprimer = false;
    for(var i = 0; i < jsonReseauManual.links.length; i++)
    {

        if((jsonReseauManual.links[i].source == source && jsonReseauManual.links[i].target == target) ||
            (jsonReseauManual.links[i].source.id == source && jsonReseauManual.links[i].target.id == target)){
            //on efface le noeud du json
            jsonReseauManual.links.splice(i, 1);

            //on efface le noeud de l'html
            $(".listeliaisons").find("[data-sourcetarget='" + sourcetarget + "']").remove();

            linkSupprimer = true;
            
            break;
        }
    }

    if(!linkSupprimer)
        alert("La liaison que vous essayer de supprimer n'existe pas");

}

function generateMyReseauManual(){
    reloadSimulationWithJson(cloneArrayObjectForReseauSchema(jsonReseauManual));
}

function cloneArrayObjectForReseauSchema(jsonToClone){


    var arrayToReturn = getJsonToClearJsonReseau();

    for(var i = 0; i < jsonToClone.nodes.length; i++){
        arrayToReturn.nodes.push({
            id: jsonToClone.nodes[i].id
        });
    }

    for(var i = 0; i < jsonToClone.links.length; i++){
        arrayToReturn.links.push({
            source: jsonToClone.links[i].source,
            target: jsonToClone.links[i].target,

        });
    }

    return arrayToReturn;

}
