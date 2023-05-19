//Given an array of letters find all words that contain each of these letters
// one time exactly
function filterByLettersOld(arr)
{
    var result = [];
    const larr = arr.length;
       
    for (var i = 0; i < gameState.all_words.length; i++) {
        var mask = [];
        for (var j = 0; j < larr; j++) {
            mask.push('0');
        }
        var word = gameState.all_words[i];
        //run over all letters of a word
        //check if current letter is in array arr and 
        // place in mask corresponding its index in arr is 0
        var valid = true;
        for (var j = 0; j < word.length; j++) {
            var ind = arr.indexOf(word[j]);
            if (ind >= 0) {
                if (mask[ind] == '0')
                    mask[ind] = '1';
                else
                    break;//go to the next word
            }
            else
            {
                if (consonants.indexOf(word[j]) >= 0)//exists not selected consonant
                {
                    valid = false;
                    break;
                }
                    
            }
        }
        //check that all elements of mask are equal to 1
        if(valid)
        for (var j = 0; j < mask.length; j++) {
            if (mask[j] != '1')
            {
                valid = false;
                break;
            }
        }
        if (valid)
            result.push(word);
    }
    return result;
}


function filterByLetters() {
    var result = [];    
    for (var i = 0; i < gameState.all_words.length; i++) {        
        var word = gameState.all_words[i];
        var valid = checkWord(word);        
        if (valid)
            result.push(word);
    }
    return result;
}
//Given current selected letters check that current word 
//contains only these consonant letters
function checkWord(word) {
    var valid = true;
    var arr = gameState.selectedLetters;
    const larr = arr.length;
    var mask = [];
    for (var j = 0; j < larr; j++) {
        mask.push('0');
    }
    //check if this word contains any letter from selectedLetters
    for (var j = 0; j < word.length; j++) {
        var ind = arr.indexOf(word[j]);
        if (ind >= 0) {
            if (mask[ind] == '0')
                mask[ind] = '1';
            else {
                valid = false;
                break;
            }               
        }
        else {
            if (consonants.indexOf(word[j]) >= 0)//exists not selected consonant
            {
                valid = false;
                break;
            }
        }
    }
    if (valid)
        for (var j = 0; j < mask.length; j++) {
            if (mask[j] != '1') {
                valid = false;
                break;
            }
        }
    
    return valid;
}
function checkWordIsInDictionary(word) {
    var valid = true;
    valid = gameState.all_words.includes(word);
    return valid;
}