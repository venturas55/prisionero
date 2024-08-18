var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})


var settingsPoints = [0, 1, 3, 5];
var settingsRound = { "strategyAcode": '', "strategyBcode": '', "pointsA": 0, "pointsB": 0, "ronda": 0, }
var friedmanFidelity;
var tttFirst;
var round = 0;
var gamesPerRound = 300;
var graaskampCounter = 1;
var respuestasRound = []; //   {"teamA":playerA, "resA":resA,"teamB":playerB,"resB": resB}
var tideman_K = 0;
var tidemanCounter = 0;
var shubik_K = 0;
var shubikCounter = 0;

var strategies = [
    { "name": 'ttt', "full_name": "tit for two tat", "Author": "Nadie lo presentó", "points": 0, "description": "Starts playind C and then plays, whenever the rival plays D he responses with two D", "position": "would´ve won" },
    { "name": 't4t', "full_name": "tit for tat", "Author": "Anatol Rapoport", "points": 0, "description": "Starts playind C and then plays, whenever the rival plays D he responses with a D", "position": 1 },
    { "name": 'tdm', "full_name": "Tideman and Chieruzzi", "Author": "T Nicolaus Tideman and Paula Chieruzz", "points": 0, "tideman_last_refresh_round": 0, "description": "Begins tit for tat. However, when the other player finishes his second run of defec- tions, an extra punishment is > instituted, and the number of punishing defections is increased by one with > each run of the other’s defections. The other player is given a fresh start > if he is 10 or more points behind, if he has not just started a run of > defections, if it has been at least 20 moves since a fresh start, if there are at least 10 moves remaining, and if the number of defections differs > from a 50-50 random generator by at least 3.0 standard deviations. A fresh start involves two cooperations and then play as if the game had just started. The program defects automatically on the last two moves.", "position": 2 },
    { "name": 'ndg', "full_name": "Nydegger", "Author": "Rudy Nydegger", "points": 0, "count": 0, "description": "The program begins with tit for tat for the first three moves, except that if it was the only one to cooperate on the first move and the only one to defect on the second move, it defects on the third move. After the third move, if all three preceding moves are mutual defection plays C.", "position": 3 },
    { "name": 'grof', "full_name": "Grofman", "Author": "Bernard Grofman", "points": 0, "description": "If the players did different things on the previous move, this rule > cooperates with probability 2/7. Otherwise this rule always cooperates", "position": 4 },
    { "name": 'sbk', "full_name": "Shubik", "Author": "Martin Shubik", "points": 0, "description": "The player cooperates, if when it is cooperating, the opponent defects it defects for k rounds. After k rounds it starts cooperating again and increments the value of k if the opponent defects again.", "position": 5, },
    { "name": 'sar', "full_name": "Stein and Rapoport", "Author": "Stein and Anatol Rapoport", "points": 0, "description": "Plays C the first 4 moves and D last two. Every 15 moves makes a chi-squared test", "position": 6 },
    { "name": 'friedman', "full_name": "Friedman-Grudger", "Author": "James W Friedman", "points": 0, "description": "Begins by playing C, then plays D for the remaining rounds if the opponent ever plays D.", "position": 7 },
    { "name": 'dav', "full_name": "Davis", "Author": "Morton Davis", "points": 0, "description": "First 10 rounds plays C, then plays Friedman", "position": 8 },
    { "name": 'graaskamp', "full_name": "Graaskamp", "Author": "Jim Graaskamp", "points": 0, "position": 9, "description": 'This rule plays tit for tat for 50 moves, defects on move 51, and then > plays 5 more moves of tit for tat. A check is then made to see if the player > seems to be RANDOM, in which case it defects from then on. A check is also > made to see if the other is TIT FOR TAT, ANALOGY (a program from the > preliminary tournament), and its own twin, in which case it plays tit for > tat. Otherwise it randomly defects every 5 to 15 moves, hoping that enough > trust has been built up so that the other player will not notice these > defections This is implemented as:        Plays Tit For Tat for the first 50 rounds;        Defects on round 51;        Plays 5 further rounds of Tit For Tat;        A check is then made to see if the opponent is playing randomly in which case it defects for the rest of the game. This is implemented with a chi squared test.        The strategy also checks to see if the opponent is playing Tit For Tat or a clone of itself. If so it plays Tit For Tat. If not it cooperates and randomly defects every 5 to 15 moves.' },
    // { "name": 'fbd', "full_name": "FirstByDowning", "Author": "Leslie Downing", "points": 0, "description": "Super long", "position": 10 },
    { "name": 'feld', "full_name": "Feld", "Author": "Scott Feld", "points": 0, "description": "Plays T4T but decreasing probability of C down to 0.5 around the round 200", "position": 11 },
    { "name": 'joss', "full_name": "Joss", "Author": "Johann Joss", "points": 0, "description": "Plays C 90% of the time", "position": 12 },
    { "name": 'tullock', "full_name": "Tullock", "Author": "Gordon Tullock", "points": 0, "description": "", "position": 13 },
    { "name": 'witheld', "full_name": "Withheld", "Author": "Unknown", "points": 0, "description": "", "position": 14 },
    { "name": 'randomize', "full_name": "Random", "Author": "Nadie", "points": 0, "description": "Plays randomly C or D", "position": 15 },

    // { "name": 'friedmanforgive', "full_name": "Friedman compasivo", "Author": "Test", "points": 0 },
    // { "name": 'rtf', "full_name": "reverse tit for tat", "Author": "Test", "points": 0, "description": "Starts playind D and then plays, whenever the rival plays C he responses with a C", "position": '' },
    // { "name": 'af', "full_name": "Nunca coopera", "Author": "Test", "points": 0, "description": "Always plays D" },
    // { "name": 'at', "full_name": "Siempre coopera", "Author": "Test", "points": 0, "description": "Always plays C" },

];

//funcion para saber si es el jugadorA o el B
function soyA(team) {
    var soyA;
    respuestasRound[0].teamA == team ? soyA = true : soyA = false;
    return soyA;
}
//Funcion que devuelve las Cooperaciones del rival
function CfromRivalOf(team) {
    var count;
    if (soyA(team)) {
        count = respuestasRound.filter(item => item.resB == true).length;
    } else {
        count = respuestasRound.filter(item => item.resA == true).length;
    }
    return count;
}


function history_of_rival_of(team) {
    var respuesta ;
    if (soyA(team)) {
        respuesta = respuestasRound.map(item => item.resB   );
    } else {
        respuesta =respuestasRound.map(item => item.resA   );
    }
    console.log(respuesta)
    return respuesta;
}
function history_of_(team) {
    var respuesta ;
    if (soyA(team)) {
        respuesta = respuestasRound.map(item => item.resA   );
    } else {
        respuesta =respuestasRound.map(item => item.resB   );
    }
    console.log(respuesta)
    return respuesta;
}

//Funcion que devuelve la ultima respuesta del rival
function last_response_of_Rival_of(team,n) {
    var respuesta ;
    if (soyA(team)) {
        respuesta = respuestasRound[respuestasRound.length-1].resB;
    } else {
        respuesta = respuestasRound[respuestasRound.length-1].resA;
    }
    return respuesta;
}

//Funcion que devuelve la ultima respuesta del propio equipo
function last_response_of(team) {
    var respuesta ;
    if (soyA(team)) {
        respuesta = respuestasRound[respuestasRound.length-1].resA;
    } else {
        respuesta = respuestasRound[respuestasRound.length-1].resB;
    }
    return respuesta;
}

//Funcion que devuelve las Cooperaciones del rival respondiendo a Cooperaciones
function number_cooperations_in_response_to_C_from_Rival_Of(team) {
    var count = 0;
    if (soyA(team)) {
        for (var i = 1; i < respuestasRound.length; i++) {
            if (respuestasRound[i - 1].resA && respuestasRound[i].resB) {
                count++;
            }
        }
    } else {
        for (var i = 1; i < respuestasRound.length; i++) {
            if (respuestasRound[i - 1].resB && respuestasRound[i].resA) {
                count++;
            }
        }
    }
    return count;
}
//Funcion que devuelve las Cooperaciones del rival respondiendo a Deflections
function number_cooperations_in_response_to_D_from_Rival_Of(team) {
    var count = 0;
    if (soyA(team)) {
        for (var i = 1; i < respuestasRound.length; i++) {
            if (!respuestasRound[i - 1].resA && respuestasRound[i].resB) {
                count++;
            }
        }
    } else {
        for (var i = 1; i < respuestasRound.length; i++) {
            if (!respuestasRound[i - 1].resB && respuestasRound[i].resA) {
                count++;
            }
        }
    }
    return count;
}

function ttt(res) {
    //La primera
    if (res === undefined) {
        return true;
    }
    //Las demas
    if (!res) {
        if (tttFirst) {
            return res;
        } else {
            tttFirst = true;
            return true;
        }
    } else {
        tttFirst = false;
        return res;
    }
}
function t4t(res) {
    //La primera
    if (res === undefined)
        return true;
    //Las demas
    else
        return res;
}
function tdm(res) {
    //La primera
    if (res === undefined)
        return true;
    //Las demas
    else {
        if (!res) {
            tideman_K++;
            tidemanCounter = tideman_K;
        }
        //Si tengo respuestas defected acumuladas devuelvo defect 
        if (tidemanCounter > 0) {
            tidemanCounter--;
            return false;
        }

        // compruebo fresh start
        if (settingsRound.strategyAcode == 'tdm') {
            //si el rival le saca 10 puntos
            if (settingsRound.pointsB - settingsRound.pointsA > 10 && gamesPerRound - round > 10 && round - strategies[2].tideman_last_refresh_round > 20) { //TODO: una desviacion standar....
                tidemanCounter = 0;
                tideman_K = 0;
            }
        } else {
            if (settingsRound.pointsA - settingsRound.pointsB > 10 && gamesPerRound - round > 10 && round - strategies[2].tideman_last_refresh_round > 20) { //TODO: una desviacion standar....
                tidemanCounter = 0;
                tideman_K = 0;
            }
        }

        return res;
    }
}
function ndg(res) {
    //var AstoDefect = [1, 6, 7, 17, 22, 23, 26, 29, 30, 31, 33, 38, 39, 45, 49, 54, 55, 58, 61];
    var A = 0;
    if (round <= 3) {
        if (round == 3) {
            if (respuestasRound[0].resA != respuestasRound[0].resB && respuestasRound[1].resA != respuestasRound[1].resB)
                return false;
        }
        return t4t(res);
    } else {
        //TODO: Faltaria identificar quien es rival y quien jugador, pero en este caso creo que no importa 
        if (soyA('ndg')) {
            A = (!respuestasRound[respuestasRound.length - 3].resA + 2 * !respuestasRound[respuestasRound.length - 3].resB) + 4 * (!respuestasRound[respuestasRound.length - 2].resA + 2 * !respuestasRound[respuestasRound.length - 2].resB) + 16 * (!respuestasRound[respuestasRound.length - 1].resA + 2 * !respuestasRound[respuestasRound.length - 1].resB);
        } else {
            A = (2 * !respuestasRound[respuestasRound.length - 3].resA + !respuestasRound[respuestasRound.length - 3].resB) + 4 * (2 * !respuestasRound[respuestasRound.length - 2].resA + !respuestasRound[respuestasRound.length - 2].resB) + 16 * (2 * !respuestasRound[respuestasRound.length - 1].resA + !respuestasRound[respuestasRound.length - 1].resB);
        }

        //console.log(A);
        if (A == 63)
            return true;
        else
            return false;
    }
}
function grof(res) {
    //La primera
    if (res === undefined) {
        return true;
    }
    //Las demas
    else if (respuestasRound[respuestasRound.length - 1].resA != respuestasRound[respuestasRound.length - 1].resB) {
        return Math.random() < (2 / 7);
    } else {
        return true;

    }
}
function sbk(res) {
    //La primera
    if (res === undefined)
        return true;
    //Las demas
    else {
        if (!res) {
            shubik_K++;
            shubikCounter = shubik_K;
        }
        if (shubikCounter > 0) {
            shubikCounter--;
            return false;
        }
        return true;
    }
}
function sar(res) {
    var sar_es_teamA, defects = 0, cooperates = 0;
    if (round < 5)
        return true;
    else if (round < 15) {
        return res;
    }

    respuestasRound[0].teamA == 'sar' ? sar_es_teamA = true : sar_es_teamA = false;
    if (sar_es_teamA) {
        for (var i = 0; i < respuestasRound.length; i++) {
            respuestasRound[i].resB ? cooperates++ : defects++;
        }
    } else {
        for (var i = 0; i < respuestasRound.length; i++) {
            respuestasRound[i].resA ? cooperates++ : defects++;
        }
    }
    //TODO: calcular respuestas del rival

    if (round % 15 == 0) {
        var p_value = chiSquared(cooperates, defects);
    }
    if (p_value > 3.841)
        return false;
    else
        return res;
}
function friedman(res) {
    //La primera
    if (res === undefined)
        return true;
    //Las demas
    if (res == false)
        friedmanFidelity = false;
    return friedmanFidelity;
}
function dav(res) {
    if (round < 10)
        return true;

    return friedman(res);
}
function graaskamp(res) {
    //La primera
    if (res === undefined)
        return true;
    //Las demas
    else if (graaskampCounter < 49) {
        graaskampCounter++;
        return res;
    }
    else {
        graaskampCounter = 0;
        return false;

    }
}
function fbd(res) {
    //La primera
    if (res === undefined)
        return false;
    //Las demas
    else if (graaskampCounter < 49) {
        graaskampCounter++;
        return res;
    }
    else {
        graaskampCounter = 0;
        return false;

    }
}
function feld(res) {
    //La primera
    if (res === undefined)
        return true;
    //Las demas
    else {
        if (res) {
            //Una probabilidad de 1 al principio, pero de 0,5 cuando va por la jugada 200. Osea calculamos pendiente
            // 0,002512563
            var slope = 0.5 / (gamesPerRound - 1);
            var limit = 1 - round * slope;
            var value = Math.random();
            return (limit > value);
        } else
            return false;
    }
}
function joss(res) {
    //La primera
    if (res === undefined)
        return true;
    //Las demas
    else if (res)
        return (Math.random() > 0.1);
    else
        return false;
}
function tullock(res) {
    if (round < 11)
        return true;
    else {
        //TODO: detectar siempre el rival... soyA(team)
        var count;
        if (soyA('tullock')) {
            // console.log('soy tullock A');
            count = respuestasRound.slice(-10).filter(item => item.resB == true).length;
        } else {
            // console.log('soy tullock B');
            count = respuestasRound.slice(-10).filter(item => item.resA == true).length;
        }
        //console.log(count);
        //Coopera un 10% menos que el rival en sus ultimos 10 rounds.
        var probabilityReturnC = count / 10 - 0.1;
        //console.log(probabilityReturnC);
        return (Math.random() < probabilityReturnC);
    }

}
function witheld(res) {
    var pvalue = 0.3;
    if (round >= 10 && round % 10) {
        var pCrival = CfromRivalOf("witheld") / round;
        pvalue = (pvalue + pCrival) / 2;
        //console.log(pvalue);
    }
    return (Math.random() < pvalue);
}
function randomize(res) {
    if (Math.random() > 0.5)
        return true;
    else
        return false;
}
function rtf(res) {
    //La primera
    if (res === undefined)
        return false;
    //Las demas
    else
        return res;
}
function friedmanforgive(res) {
    var fidelity = true;
    //La primera
    if (res === undefined)
        return true;
    //Las demas
    if (res == false)
        fidelity = false;
    return fidelity;
}
function at(res) {
    return true;
}
function af(res) {
    return false;
}
function playRival(player, res) {
    switch (player) {
        case 'ttt':
            return ttt(res);
        case 't4t':
            return t4t(res);
        case 'tdm':
            return tdm(res);
        case 'ndg':
            return ndg(res);
        case 'grof':
            return grof(res);
        case 'sbk':
            return sbk(res);
        case 'sar':
            return sar(res);
        case 'friedman':
            return friedman(res);
        case 'dav':
            return dav(res);
        case 'graaskamp':
            return graaskamp(res);
        case 'fbd':
            return fbd(res);
        case 'feld':
            return feld(res);
        case 'joss':
            return joss(res);
        case 'tullock':
            return tullock(res);
        case 'witheld':
            return witheld(res);
        case 'randomize':
            return randomize(res);
        case 'friedmanforgive':
            return friedmanforgive(res);
        case 'at':
            return at(res);
        case 'af':
            return af(res);
        case 'rtf':
            return rtf(res);
    }
}
function addround(colaboraA, colaboraB) {
    var panel = document.getElementById("panel");
    var div = document.createElement("div");
    var divA = document.createElement("div");
    var divB = document.createElement("div");
    div.className = "roundcouple";
    divA.innerHTML = Math.floor(round);
    divB.innerHTML = Math.floor(round);
    if (colaboraA)
        divA.className = 'dot coopera';
    else
        divA.className = 'dot deserta';
    if (colaboraB)
        divB.className = 'dot coopera';
    else
        divB.className = 'dot deserta';
    div.appendChild(divA);
    div.appendChild(divB);
    panel.appendChild(div)
    settingsRound.ronda += 0.5;
}
function addMark() {
    document.getElementById("pointsA").innerHTML = " consiguió un total de " + settingsRound.pointsA + " puntos";
    document.getElementById("pointsB").innerHTML = " consiguió un total de " + settingsRound.pointsB + " puntos";
}
function sumPoints(resA, resB) {
    if (resA) {
        if (resB) {
            settingsRound.pointsA += settingsPoints[2];
            settingsRound.pointsB += settingsPoints[2];
        } else {
            settingsRound.pointsA += settingsPoints[0];
            settingsRound.pointsB += settingsPoints[3];
        }

    } else {
        if (resB) {
            settingsRound.pointsA += settingsPoints[3];
            settingsRound.pointsB += settingsPoints[0];
        } else {
            settingsRound.pointsA += settingsPoints[1];
            settingsRound.pointsB += settingsPoints[1];
        }
    }
}
function playGame() {
    playRound(document.getElementById("strategyA").value, document.getElementById("strategyB").value);

}
function playRound(playerA, playerB) {
    round = 0;
    tttFirst = false;
    settingsRound.ronda = 1;
    nydegerCounter = 0;
    shubik_K = 0;
    shubikCounter = 0;
    friedmanFidelity = true;
    tideman_K = 0;
    tidemanCounter = 0;
    respuestasRound = [];

    settingsRound.pointsA = settingsRound.pointsB = 0;

    var panel = document.getElementById("panel");
    while (panel.firstChild) {
        panel.removeChild(panel.firstChild);
    }

    var resA, resAanterior, resB, resBanterior;

    for (var i = 0; i < gamesPerRound; i++) {
        round++;
        //Esto se añade para impedir que el segundo sea conocedor de la respuesta del primero en cada ronda. 
        //Cada ronda se ejecuta en funcion de las respuestas de la ronda anterior
        resAanterior = resA;
        resBanterior = resB;

        resA = playRival(playerA, resBanterior);
        resB = playRival(playerB, resAanterior);

        addround(resA, resB);

        sumPoints(resA, resB);
        respuestasRound.push({ "teamA": playerA, "resA": resA, "teamB": playerB, "resB": resB });

    }
    addMark(settingsRound.pointsA, settingsRound.pointsB);
    return [pointsA, pointsB];

}
function playRoyalRumble() {
    for (var i = 0; i < strategies.length; i++) {
        for (var j = 0; j < strategies.length; j++) {
            playRound(strategies[i].name, strategies[j].name);
            strategies[i].points += settingsRound.pointsA;
            strategies[j].points += settingsRound.pointsB;
        }
    }
    strategies = strategies.sort((p1, p2) => (p1.points < p2.points) ? 1 : (p1.points > p2.points) ? -1 : 0);
    addResults();
}
function addResults() {
    var panel = document.getElementById("panel2");
    var clasificacion = "<table class='table w-100 table-success table-striped table-hover'>  <thead> <tr><th>Code</th><th>Pos in 1st Axelrod Tournament</th><th>Titulo</th><th>Autor</th> <th>Puntuación</th> </tr> "
        + strategies.map(item => ("<tr data-bs-toggle='popover' title='Popover title' data-bs-content='" + item.description + "'><th>" + item.name + "</th> " + "<td>" + item.position + "</td>   <td>" + item.full_name + "</td> <td> " + item.Author + "</td> <td> " + item.points + "</td></tr>")).join('') +
        '</table>';


    panel.innerHTML = clasificacion;
}

playRoyalRumble();