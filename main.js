const NB_CASES = 4;
const NB_COLORS = 6;

function check_user_sequence(userSequence, solution) {
    let indices = new Array(NB_CASES);
    // Copy solution
    let copySolution = new Array(NB_CASES);
    let i = NB_CASES;
    while(i--) copySolution[i] = solution[i];
    // Count colors occurences
    let colorsOccurences = new Array(NB_COLORS);
    for (color of copySolution) {
        colorsOccurences[color] = colorsOccurences[color] ? colorsOccurences[color]+1 : 1;
    }
    console.log(colorsOccurences);
    // Indicate BP
    for (i in userSequence) {
        if (copySolution[i] == userSequence[i]) {
            indices[i] = "BP";
            copySolution[i] = -1;
        }
    }
    // Indicate MP
    for (i in userSequence) {
        let color = userSequence[i];
        if (indices[i] != "BP") {
            if (copySolution.includes(color) && colorsOccurences[color]>0) {
                indices[i] = "MP";
                colorsOccurences[color]--;
            } else {
                indices[i] = "-";
            }
        }
    }
    return indices;
}
console.log(check_user_sequence([1,2,3,4], [1,2,3,4])); // Expected BP, BP, BP, BP
console.log(check_user_sequence([1,2,2,4], [1,2,3,0])); // Expected BP, BP, -, -
console.log(check_user_sequence([1,2,2,4], [1,3,2,0])); // Expected BP, -, BP, -
console.log(check_user_sequence([0,2,2,1], [1,3,2,0])); // Expected MP, -, BP, MP
console.log(check_user_sequence([1,1,1,2], [1,1,1,1])); // Expected BP, BP, BP, -
console.log(check_user_sequence([2,3,2,2], [1,2,3,0])); // Expected MP, MP, -, -
console.log(check_user_sequence([1,2,3,4], [2,2,3,4])); // Expected -, BP, BP, BP
console.log(check_user_sequence([3,4,4,4], [1,2,3,3])); // Expected MP,-,-,-