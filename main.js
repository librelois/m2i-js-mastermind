// Enable popover
$(function () {
    $('[data-toggle="popover"]').popover()
})

// Define constants
const NB_CASES = 4;
const COLORS = ["red", "green", "blue", "yellow", "grey", "white"];
const DEFAULT_COLOR = 5;
const NB_COLORS = COLORS.length;
const MAX_ATTEMPS = 12;
const INDICE_HTML = "<div class='indice'></div>";

// Global variables
var gagne = false;
var countAttemps = 0;
var userSequence = new Array(NB_CASES);
var solution = new Array(NB_CASES);

/*
 * GAME LOGIC FUNCTIONS
 */

function init_game() {
    // Clear user sequence
    clear_user_sequence();
    // Generate random solution
    generate_random_solution();
}

function generate_random_solution() {
    for (let i = 0; i < NB_CASES; i++) {
        solution[i] = Math.floor(Math.random() * NB_COLORS);
    }
    console.log("solution=");
    console.log(solution);
}

function check_user_sequence() {
    return check_user_sequence_(userSequence, solution);
}

function check_user_sequence_(prop, sol) {
    let indices = new Array(NB_CASES);
    // Copy solution
    let copySolution = new Array(NB_CASES);
    let i = NB_CASES;
    while (i--) copySolution[i] = sol[i];
    // Count colors occurences
    let colorsOccurences = new Array(NB_COLORS);
    for (color of copySolution) {
        colorsOccurences[color] = colorsOccurences[color] ? colorsOccurences[color] + 1 : 1;
    }
    // Indicate BP
    for (i in prop) {
        let color = prop[i];
        if (copySolution[i] == prop[i]) {
            indices[i] = "BP";
            colorsOccurences[color]--;
            copySolution[i] = -1;
        }
    }
    // Indicate MP
    for (i in prop) {
        let color = prop[i];
        if (indices[i] != "BP") {
            if (copySolution.includes(color) && colorsOccurences[color] > 0) {
                indices[i] = "MP";
                colorsOccurences[color]--;
            } else {
                indices[i] = "-";
            }
        }
    }
    return indices
}

/*
// TEST check_user_sequence()
console.log(check_user_sequence_([1,2,3,4], [1,2,3,4])); console.log("Expected BP, BP, BP, BP");
console.log(check_user_sequence_([1,2,2,4], [1,2,3,0])); console.log("Expected BP, BP, -, -");
console.log(check_user_sequence_([1,2,2,4], [1,3,2,0])); console.log("Expected BP, -, BP, -");
console.log(check_user_sequence_([0,2,2,1], [1,3,2,0])); console.log("Expected MP, -, BP, MP");
console.log(check_user_sequence_([1,1,1,2], [1,1,1,1])); console.log("Expected BP, BP, BP, -");
console.log(check_user_sequence_([2,3,2,2], [1,2,3,0])); console.log("Expected MP, MP, -, -");
console.log(check_user_sequence_([1,2,3,4], [2,2,3,4])); console.log("Expected -, BP, BP, BP");
console.log(check_user_sequence_([3,4,4,4], [1,2,3,3])); console.log("Expected MP,-,-,-");
console.log(check_user_sequence_([1,2,2,2], [ 2, 4, 1, 2 ])); console.log("Expected MP, MP, -, BP");
console.log(check_user_sequence_([ 5, 0, 0, 2 ], [ 3, 0, 0, 5 ])); console.log("Expected MP, BP, BP, -");
*/

function submit_user_seq() {
    if (gagne) {
        // Start new game
    } else {
        console.log(userSequence);
        show_indices(check_user_sequence());
        show_user_attemp();
    }
}

function clear_user_sequence() {
    for (let i = 0; i < NB_CASES; i++) {
        userSequence[i] = DEFAULT_COLOR;
    }
}

/*
 * PAINTING FUNCTIONS
 */

function show_indices(indices) {
    // Count indices per types
    let countBP = 0;
    let countMP = 0;
    for (e of indices) {
        if (e == "BP") {
            countBP++;
        } else if (e == "MP") {
            countMP++;
        }
    }
    // Check end of game
    if (countBP == NB_CASES) {
        gagne = true;
        show_solution();
    } else if (countAttemps + 1 == MAX_ATTEMPS) {
        disable_submit();
    }
    // Show indices
    let indice_index = (MAX_ATTEMPS - countAttemps - 1) * 4;
    while (countBP > 0) {
        $(".indice")[indice_index].style.backgroundColor = 'black';
        countBP--;
        indice_index++;
    }
    while (countMP > 0) {
        $(".indice")[indice_index].style.backgroundColor = 'white';
        countMP--;
        indice_index++;
    }
    countAttemps++;
}

function show_user_attemp() {
    let user_attemp_index = (MAX_ATTEMPS - countAttemps) * 4;
    console.log($(".row_user_attemp")[MAX_ATTEMPS - countAttemps]);
    $(".row_user_attemp")[MAX_ATTEMPS - countAttemps].style.display = 'flex';
    $(".user_attemp")[user_attemp_index + 0].style.backgroundColor = COLORS[userSequence[0]];
    $(".user_attemp")[user_attemp_index + 1].style.backgroundColor = COLORS[userSequence[1]];
    $(".user_attemp")[user_attemp_index + 2].style.backgroundColor = COLORS[userSequence[2]];
    $(".user_attemp")[user_attemp_index + 3].style.backgroundColor = COLORS[userSequence[3]];
}

function show_solution() {
    $(".solution_box").css("background-color", "rgba(0,0,0,0)");
    console.log($(".solution")[0]);
    $(".solution")[0].style.backgroundColor = COLORS[solution[0]];
    $(".solution")[1].style.backgroundColor = COLORS[solution[1]];
    $(".solution")[2].style.backgroundColor = COLORS[solution[2]];
    $(".solution")[3].style.backgroundColor = COLORS[solution[3]];
    $(".solution")[0].innerHTML= "";
    $(".solution")[1].innerHTML= "";
    $(".solution")[2].innerHTML= "";
    $(".solution")[3].innerHTML= "";
}

function disable_submit() {
    $("#submit_user_seq").prop('disabled', true);
}

$("document").ready(() => {
    // Initialize game
    init_game();
    // Define events listeners
    $("#submit_user_seq").click(submit_user_seq);
    $("#p1_red").click(function () {
        $("#p1").css("background-color", COLORS[0]);
        userSequence[0] = 0;
    })
    $("#p1_green").click(function () {
        $("#p1").css("background-color", COLORS[1]);
        userSequence[0] = 1;
    })
    $("#p1_blue").click(function () {
        $("#p1").css("background-color", COLORS[2]);
        userSequence[0] = 2;
    })
    $("#p1_yellow").click(function () {
        $("#p1").css("background-color", COLORS[3]);
        userSequence[0] = 3;
    })
    $("#p1_grey").click(function () {
        $("#p1").css("background-color", COLORS[4]);
        userSequence[0] = 4;
    })
    $("#p1_dark").click(function () {
        $("#p1").css("background-color", COLORS[5]);
        userSequence[0] = 5;
    })
    $("#p2_red").click(function () {
        $("#p2").css("background-color", COLORS[0]);
        userSequence[1] = 0;
    })
    $("#p2_green").click(function () {
        $("#p2").css("background-color", COLORS[1]);
        userSequence[1] = 1;
    })
    $("#p2_blue").click(function () {
        $("#p2").css("background-color", COLORS[2]);
        userSequence[1] = 2;
    })
    $("#p2_yellow").click(function () {
        $("#p2").css("background-color", COLORS[3]);
        userSequence[1] = 3;
    })
    $("#p2_grey").click(function () {
        $("#p2").css("background-color", COLORS[4]);
        userSequence[1] = 4;
    })
    $("#p2_dark").click(function () {
        $("#p2").css("background-color", COLORS[5]);
        userSequence[1] = 5;
    })
    $("#p3_red").click(function () {
        $("#p3").css("background-color", COLORS[0]);
        userSequence[2] = 0;
    })
    $("#p3_green").click(function () {
        $("#p3").css("background-color", COLORS[1]);
        userSequence[2] = 1;
    })
    $("#p3_blue").click(function () {
        $("#p3").css("background-color", COLORS[2]);
        userSequence[2] = 2;
    })
    $("#p3_yellow").click(function () {
        $("#p3").css("background-color", COLORS[3]);
        userSequence[2] = 3;
    })
    $("#p3_grey").click(function () {
        $("#p3").css("background-color", COLORS[4]);
        userSequence[2] = 4;
    })
    $("#p3_dark").click(function () {
        $("#p3").css("background-color", COLORS[5]);
        userSequence[2] = 5;
    })
    $("#p4_red").click(function () {
        $("#p4").css("background-color", COLORS[0]);
        userSequence[3] = 0;
    })
    $("#p4_green").click(function () {
        $("#p4").css("background-color", COLORS[1]);
        userSequence[3] = 1;
    })
    $("#p4_blue").click(function () {
        $("#p4").css("background-color", COLORS[2]);
        userSequence[3] = 2;
    })
    $("#p4_yellow").click(function () {
        $("#p4").css("background-color", COLORS[3]);
        userSequence[3] = 3;
    })
    $("#p4_grey").click(function () {
        $("#p4").css("background-color", COLORS[4]);
        userSequence[3] = 4;
    })
    $("#p4_dark").click(function () {
        $("#p4").css("background-color", COLORS[5]);
        userSequence[3] = 5;

    })
});
