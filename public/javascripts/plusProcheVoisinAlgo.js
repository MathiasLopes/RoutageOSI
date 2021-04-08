

//methode qui permet de récupérer la distance la plus courte entre deux noeuds
let findPlusProcheVoisinPath = (graph, startNode, endNode) => {
    
    var path = [startNode];
    path = findMonVoisinLePlusProche(path, endNode, startNode, graph, []);

    let results = {
        distance: 0,
        path: path
    };

    // renvoie le chemin des plus proche voisin et la distance du nœud final par rapport au nœud de départ.
    return results;
};

function findMonVoisinLePlusProche(path, endNode, previousNode, graph, nodeToIgnore){

    console.log(path);

    var distanceMin = -1;
    var nameNodeMin = "";

    //liste des noeuds suivant possible
    var listeNextNode = graph[previousNode]

    //recuperation du noeud suivant le plus proche
    for(var node in listeNextNode){

        var name_node = node;
        var distance = graph[previousNode][node];

        console.log("name_node : ", name_node + " " + distance + "/" + distanceMin + "/" + nameNodeMin);
        console.log(NodeIsNotInPath(nodeToIgnore, name_node));

        if((distanceMin == -1 || distanceMin > distance) && 
            NodeIsNotInPath(path, name_node) && 
            NodeIsNotInPath(nodeToIgnore, name_node)){
            distanceMin = distance;
            nameNodeMin = name_node;
        }
    }

    //si aucun noeud n'a été trouvé et que le noeud trouvé n'est pas le noeud de fin
    if(distanceMin == -1 && nameNodeMin != endNode){

        //on supprime l'ancien noeud
        path.pop();

        //on ajoute le dernier noeud a ignoré
        nodeToIgnore.push(previousNode);

        //on remonte d'un cran
        return findMonVoisinLePlusProche(path, endNode, path[path.length - 1], graph, nodeToIgnore);
    }

    path.push(nameNodeMin);
    previousNode = nameNodeMin;

    if(nameNodeMin == endNode)
        return path;
    else
        return findMonVoisinLePlusProche(path, endNode, previousNode, graph, nodeToIgnore);
}

function NodeIsNotInPath(path, name_node){

    var nodeIsNotInPath = true;

    for(var i = 0; i < path.length; i++)
    {
        if(path[i] == name_node){
            nodeIsNotInPath = false;
            break;
        }
    }

    return nodeIsNotInPath;
}

//fabrique le json necessaire à l'utilisation de l'algorithme avec le graph passé en parametre
function getGraphForPlusProcheVoisinAlgo(graph) {

    var jsonForPlusProcheVoisin = {};

    //pour chaque noeud on va faire la liste des liaisons avec la distance
    for (var i = 0; i < graph.nodes.length; i++) {
        var node = graph.nodes[i];
        jsonForPlusProcheVoisin[node.id] = {};

        for (var j = 0; j < graph.links.length; j++) {
            var link = graph.links[j];
            
            if(link.source == node.id){
                jsonForPlusProcheVoisin[node.id][link.target] = link.distance; 
            }else if(link.target == node.id){
                jsonForPlusProcheVoisin[node.id][link.source] = link.distance; 
            }
        }
    }

    return jsonForPlusProcheVoisin;
}