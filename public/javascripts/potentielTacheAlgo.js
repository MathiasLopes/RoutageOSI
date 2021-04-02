//methode permetant de recuperer la distance la plus courte
let longestDistanceNode = (distances, visited) => {
    // créer une valeur par défaut pour le plus court
    let longest = null;

    // pour chaque noeud de l'objet distances
    for (let node in distances) {
        // si aucun nœud n'a encore été assigné au plus court
        // ou si la distance du nœud actuel est inférieure à la plus courte distance actuelle.
        let currentIsLongest =
        longest === null || distances[node] < distances[longest];

        // et si le nœud actuel est dans l'ensemble non visité
        if (currentIsLongest && !visited.includes(node)) {
            // mettre à jour le plus court pour qu'il soit le nœud actuel
            longest = node;
        }
    }
    return longest;
};

//methode qui permet de récupérer la distance la plus courte entre deux noeuds
let findLongestPath = (graph, startNode, endNode) => {

    // suivre les distances depuis le nœud de départ en utilisant un objet de hachage.
    let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);

    // suivre les chemins en utilisant un objet de hachage
    let parents = { endNode: null };
    for (let child in graph[startNode]) {
        parents[child] = startNode;
    }

    // collecte les noeuds visités
    let visited = [];
    // trouver le nœud le plus proche
    let node = longestDistanceNode(distances, visited);

    //pour chaque noeuds
    while (node) {
        // Trouver sa distance par rapport au nœud de départ et à ses nœuds enfants.
        let distance = distances[node];
        let children = graph[node];

        // pour chacun de ces noeuds enfants :
        for (let child in children) {

            // s'assurer que chaque nœud enfant n'est pas le nœud de départ
            if (String(child) === String(startNode)) {
                continue;
            } else {
                // enregistre la distance entre le nœud de départ et le nœud enfant.
                let newdistance = distance + children[child];
                // s'il n'y a pas de distance enregistrée entre le nœud de départ et le nœud enfant dans l'objet distances.
                // ou si la distance enregistrée est plus courte que la distance précédemment enregistrée entre le noeud de départ et le noeud enfant.
                if (!distances[child] || distances[child] > newdistance) {
                    // enregistrer la distance à l'objet
                    distances[child] = newdistance;
                    // enregistre le chemin
                    parents[child] = node;
                }
            }
        }
        // déplace le nœud actuel vers l'ensemble visité
        visited.push(node);
        // se déplace vers le nœud voisin le plus proche
        node = longestDistanceNode(distances, visited);
    }

    // utiliser les chemins stockés du nœud de départ au nœud d'arrivée.
    // enregistrer le chemin le plus court
    let longestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
        longestPath.push(parent);
        parent = parents[parent];
    }
    longestPath.reverse();

    //ceci est le chemin le plus court
    let results = {
        distance: distances[endNode],
        path: longestPath,
    };

    // renvoie le chemin le plus court et la distance du nœud final par rapport au nœud de départ.
    return results;
};

//fabrique le json necessaire à l'utilisation de l'algorithme avec le graph passé en parametre
function getGraphForPotentielTacheAlgo(graph) {

    var jsonForPotentielTache = {};

    //pour chaque noeud on va faire la liste des liaisons avec la distance
    for (var i = 0; i < graph.nodes.length; i++) {
        var node = graph.nodes[i];
        jsonForPotentielTache[node.id] = {};

        for (var j = 0; j < graph.links.length; j++) {
            var link = graph.links[j];
            
            if(link.source == node.id){
                jsonForPotentielTache[node.id][link.target] = 1; 
            }else if(link.target == node.id){
                jsonForPotentielTache[node.id][link.source] = 1; 
            }
        }
    }

    return jsonForPotentielTache;
}