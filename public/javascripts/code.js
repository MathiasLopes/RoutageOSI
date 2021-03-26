var jsonGraphActual = null;

var svg = d3.select("svg"),
    width = +svg.node().getBoundingClientRect().width,
    height = +svg.node().getBoundingClientRect().height;

// svg objects
var link, node, circles, label;
// the data - an object with nodes and links
var graph;

function reloadSimulationWithJson(json) {
    d3.selectAll("g").remove();
    graph = json;
    jsonGraphActual = cloneArrayObjectForReseauSchema(json);
    updateNodesInSelectedForPathAndAlgo();
    initializeDisplay();
    initializeSimulation();
}

//////////// FORCE SIMULATION //////////// 

// force simulator
var simulation = d3.forceSimulation();

// set up the simulation and event to update locations after each tick
function initializeSimulation() {
    simulation.nodes(graph.nodes);
    initializeForces();
    simulation.on("tick", ticked);
}

// values for all forces
forceProperties = {
    center: {
        x: 0.5,
        y: 0.5
    },
    charge: {
        enabled: true,
        strength: -30,
        distanceMin: 1,
        distanceMax: 2000
    },
    collide: {
        enabled: true,
        strength: .7,
        iterations: 1,
        radius: 50
    },
    forceX: {
        enabled: false,
        strength: .1,
        x: .5
    },
    forceY: {
        enabled: false,
        strength: .1,
        y: .5
    },
    link: {
        enabled: true,
        distance: 60,
        iterations: 1
    }
}

// add forces to the simulation
function initializeForces() {
    // add forces and associate each with a name
    simulation
        .force("link", d3.forceLink())
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter())
        .force("collide", d3.forceCollide())
    /*.force("forceX", d3.forceX())
    .force("forceY", d3.forceY());*/
    // apply properties to each of the forces
    updateForces();
}

// apply new force properties
function updateForces() {


    // get each force by name and update the properties
    simulation.force("center")
        .x(width * forceProperties.center.x)
        .y(height * forceProperties.center.y);
    simulation.force("charge")
        .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        .distanceMin(forceProperties.charge.distanceMin)
        .distanceMax(forceProperties.charge.distanceMax);
    simulation.force("link")
        .id(function (d) { return d.id; })
        .distance(forceProperties.link.distance)
        .iterations(forceProperties.link.iterations)
        .links(forceProperties.link.enabled ? graph.links : []);
    simulation.force("collide")
        .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
        .radius(forceProperties.collide.radius)
        .iterations(forceProperties.collide.iterations);
    /*simulation.force("forceX")
        .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
        .x(width * forceProperties.forceX.x);
    simulation.force("forceY")
        .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
        .y(height * forceProperties.forceY.y);*/

    // updates ignored until this is run
    // restarts the simulation (important if simulation has already slowed down)
    simulation.alpha(1).restart();
}



//////////// DISPLAY ////////////

// generate the svg objects and force simulation
function initializeDisplay() {

    // set the data and properties of link lines
    link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("data-source", function (d){ return d.source; })
        .attr("data-target", function (d){ return d.target; });


    // set the data and properties of node circles
    node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")

    circles = node.append("circle")
        .attr("r", 5)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    //label
    label = node.append("text")
        .text(function (d) {
            return d.id;
        })
        .attr('x', 6)
        .attr('y', 3);

    // visualize the graph
    updateDisplay();
}

// update the display based on the forces (but not positions)
function updateDisplay() {
    //node
    //.attr("r", forceProperties.collide.radius)
    //.attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
    //.attr("stroke-width", forceProperties.charge.enabled==false ? 0 : Math.abs(forceProperties.charge.strength)/15);

    link
        .attr("stroke", "#999")
        .attr("stroke-width", forceProperties.link.enabled ? 1 : .5)
        .attr("opacity", forceProperties.link.enabled ? 1 : 0);

}

var intervalAlgorithmColor = null;
function launchIntervalAlgorithmColor(linksToColor) {

    if (intervalAlgorithmColor != null)
        clearInterval(intervalAlgorithmColor);

    var compteur = 0;

    intervalAlgorithmColor = setInterval(function () {

        resetColorOfAllLinks();

        if(compteur >= linksToColor.length){
            
            clearInterval(intervalAlgorithmColor);
            return;
        }

        var lines = $("line");

        for(var i = 0; i < lines.length; i++){
            var line = lines[i];
            var source = $(line).data("source");
            var target = $(line).data("target");

            if(source == linksToColor[compteur].source && target == linksToColor[compteur].target)
                $(line).attr("stroke", "red");

        }

        compteur++;
    }, 1000);
}

function resetColorOfAllLinks() {
    link.attr("stroke", "#999");
}

// update the display positions after each simulation tick
function ticked() {

    link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

    node
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })

    d3.select('#alpha_value').style('flex-basis', (simulation.alpha() * 100) + '%');
}



//////////// UI EVENTS ////////////

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// update size-related forces
d3.select(window).on("resize", function () {
    width = +svg.node().getBoundingClientRect().width;
    height = +svg.node().getBoundingClientRect().height;
    updateForces();
});


// convenience function to update everything (run after UI input)
function updateAll() {
    updateForces();
    updateDisplay();
}

//met à jour les noeuds possible dans les select
function updateNodesInSelectedForPathAndAlgo() {

    var htmlToAdd = "";

    htmlToAdd += '<option value="">Choix</option>'

    for (var i = 0; i < jsonGraphActual.nodes.length; i++) {
        htmlToAdd += '<option value="' + jsonGraphActual.nodes[i].id + '">' + jsonGraphActual.nodes[i].id + '</option>';
    }

    $("#noeud1ForAlgo").html(htmlToAdd);
    $("#noeud2ForAlgo").html(htmlToAdd);
}

//permet de gérer les types d'algorithme
function launchPathColor() {

    var choixAlgo = $("#choixAlgo").val();
    var noeud1 = $("#noeud1ForAlgo").val();
    var noeud2 = $("#noeud2ForAlgo").val();

    if (noeud1 != "" && noeud2 != "") {
        if (noeud1 != noeud2){

            switch (choixAlgo) {
                case "dijkstras":
                    var completePath = findShortestPath(getGraphForDijkstrasAlgo(jsonGraphActual), noeud1, noeud2);
                    var linksToColor = getLinksToColor(completePath);
                    launchIntervalAlgorithmColor(linksToColor);
                    break;
                case "potentielTache" :
                    var completePath = findShortestPath(getGraphForPotentielTacheAlgo(jsonGraphActual), noeud1, noeud2);
                    var linksToColor = getLinksToColor(completePath);
                    launchIntervalAlgorithmColor(linksToColor);
                    break;
                default:
                    alert("L'algorithme choisi n'est pas géré");
                    break;
            }
        }else
            alert("Les noeuds sélectionnés doivent être différents");
    }else
        alert("Vous devez sélectionner un noeud de début et un neoud de fin");

}

//permet de récupérer les liaisons à colorer
function getLinksToColor(path){

    var links = [];
    path = path.path;

    //pour chaque chemin à prendre on determine la liaison dans le graphique
    for(var i = 0; i < path.length - 1; i++){

        var liaisonExist = false;

        for(var j = 0; j < jsonGraphActual.links.length; j++){

            if(jsonGraphActual.links[j].source == path[i] && jsonGraphActual.links[j].target == path[i+1])
            {
                liaisonExist = true;
                links.push(jsonGraphActual.links[j]);
            }

            if(jsonGraphActual.links[j].target == path[i] && jsonGraphActual.links[j].source == path[i+1])
            {
                liaisonExist = true;
                links.push(jsonGraphActual.links[j]);
            }
        }
    }

    return links;
}