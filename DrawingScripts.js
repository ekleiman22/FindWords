//letters grid settings

const minSelectedLettersCount = 2;
const maxSelectedLettersCount = 4;


const letterOffsetX = 5;
const letterOffsetY = 20;
const tryFontName = "Arial";
//**Keyboard settings:
const keyRowsCount = 3;
const keyColumnsCount = 12;
const keyBoxWidth = 25;
const keyBoxHeight = 30;
const distHorBetweenKeyBoxes = 5;
const distVertBetweenKeyBoxes = 5;
const keyLeftOffset = 5;
var keyTopOffset = 15;
const keyFontSize = 16;
const keyFontFamily = "Arial Unicode MS";
const specialKeysIndices = [0, 6];
const lastKeyRowIndex = 2;
const specialKeyLeftOffset = 55;
const specialKeyRightOffset = 40;
//const   leftMarginKeyBoxes = 10;
const upMarginKeyBoxes = 10;
//letters for keyboard
var letRow0 = [ "ц",  "к",  "н", "г", "ш", "щ", "з", "х" ];
var letRow1 = ["ф",  "в",  "п", "р",  "л", "д", "ж"];
var letRow2 = ["Очистить", "ч", "с", "м",  "т",  "б", "Ввод"];
var allKeys = [letRow0, letRow1, letRow2];
var consonants =
    ["ц", "к", "н", "г", "ш", "щ", "з", "х", "ф", "в", "п", "р", "л", "д", "ж","ч", "с", "м", "т", "б"];
var messages =
    [
        "Выбрать от {0} до {1} букв",
        "Неверное слово",
        "Не выбраны согласные",
        "Это слово не принадлежит нашему словарю",
        "Это слово уже найдено"
    ];


function drawKeyRectangle(keyRow, keyColumn,
    xUpperLeft, yUpperLeft, width, height, canvasId,
    color, lineWidth, letter) {
    let path1 = new Path2D();
    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    path1.rect(xUpperLeft, yUpperLeft, width, height);
    ctx.stroke(path1);

    // Listen for mouse down
    {
        c.addEventListener('mousedown', function (event) {
            // Check whether point is inside rectangle
            if (ctx.isPointInPath(path1, event.offsetX, event.offsetY)) {
                //get canvas coordinates of free cell                
                processKeyMouseDown(keyRow, keyColumn, letter);
            }

        });
    }
}

//if letter key was clicked then show the letter in corresponding rectangle
function processKeyMouseDown(keyRow, keyColumn, letter) {
   
    
    if (keyRow != lastKeyRowIndex ||
        (keyColumn != specialKeysIndices[0] && keyColumn != specialKeysIndices[1])) {
        gameState.addSelectedLetter(letter);
       //add selected letter to input box
        var inputValue = $("#txtSelectedLetters").val();
        if (inputValue != "")
            $("#txtSelectedLetters").val(inputValue+"," + letter);
        else
            $("#txtSelectedLetters").val(letter);
    }
    else {
        processSpecialKeys(keyColumn)
    }
}
function processSpecialKeys(keyColumn) {
    if (keyColumn == specialKeysIndices[0]) {//delete selected letters
        $("#txtSelectedLetters").val("");          
        $('#txtUserWords').val("");
        $('#txtDictCount').val("");
        $('#txtCountUserWords').val("");
        
        gameState = new GameState();
        readTextFile(nounsFile);
    }
    if (keyColumn == specialKeysIndices[1]) {
        if (gameState.selectedLetters.length < minSelectedLettersCount ||
            gameState.selectedLetters.length> maxSelectedLettersCount ) {
            alert(messages[0].replace('{0}', minSelectedLettersCount).replace('{1}', maxSelectedLettersCount));
            return;
        }
        //process input
        var inputValue = $("#txtSelectedLetters").val();
        gameState.selectedLetters = inputValue.split(",");
        var words = filterByLetters();
        gameState.validWords = words;
        $("#txtDictCount").val(words.length);
    }//case Enter
   

}



function drawText(canvasId, text, x, y, fontSize, fontFamily) {
    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");
    ctx.font = fontSize + "px " + " " + fontFamily;
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
}

function drawTextInBox(canvasId, text, x, y, fontSize, fontFamily, textColor, boxWidth) {
    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");
    ctx.font = fontSize + "px " + " " + fontFamily;
    ctx.fillStyle = textColor;
    var textWidth = ctx.measureText(text).width;
    var leftOffSet = (boxWidth - textWidth) / 2;
    var topOffSet = 20;
    ctx.fillText(text, x + leftOffSet, y + topOffSet);
}



function buildKeyBoxes(containerId, canvasId) {
    try {
        // container.Controls.Clear();

        var columnsCount = 0;
        var currentLeftPos = 0;
        var currentTopPos = 0;
        var container = document.getElementById(containerId);
        for (var j = 0; j < keyRowsCount; j++) {
            switch (j) {
                case 0:
                    columnsCount = letRow0.length;
                    break;
                case 1:
                    columnsCount = letRow1.length;;
                    break;
                case 3:
                    columnsCount =letRow2.length;
                    break;
            }
            var leftMarginKeyBoxes =
                getLeftPosition(container, columnsCount, keyBoxWidth, distHorBetweenKeyBoxes);
            for (var i = 0; i < columnsCount; i++) {

                //position of left up vertex of current box
                currentLeftPos = leftMarginKeyBoxes +
                    i * (distHorBetweenKeyBoxes + keyBoxWidth);
                if (j == 2 && i == specialKeysIndices[0]) {
                    currentLeftPos -= specialKeyLeftOffset;
                }
                currentTopPos = upMarginKeyBoxes +
                    j * (distVertBetweenKeyBoxes + keyBoxHeight);

                var keyBoxWidthFixed = keyBoxWidth;
                if (j == 2 && (i == specialKeysIndices[0]))
                    keyBoxWidthFixed = keyBoxWidth + specialKeyLeftOffset;
                if (j == 2 && (i == specialKeysIndices[1]))
                    keyBoxWidthFixed = keyBoxWidth + specialKeyRightOffset;
                var toAddListener = true;
                var letter = getKeyLetter(j, i);
                //gameState.addCellToKeyGrid(j, i, currentLeftPos, currentTopPos, letter);
                drawKeyRectangle(j, i,
                    currentLeftPos, currentTopPos, keyBoxWidthFixed, keyBoxHeight,
                    canvasId, "black", 1, letter);

                drawKeyText(canvasId, j, i, currentLeftPos + keyLeftOffset,
                    currentTopPos + keyTopOffset);

            }
        }
    }
    catch (ex) {

        throw ex;
    }
}

function getLeftPosition(container, columnsCount, boxWidth, distBetweenBoxes) {
    var result = 0;
    var temp1 = columnsCount;
    var temp2 = temp1 / 2;
    result = Math.round(container.clientWidth / 2 - temp2 * (boxWidth + distBetweenBoxes));

    return result;
}
function getKeyLetter(row, col) {
    var text = allKeys[row][col];
    return text;
}
function drawKeyText(canvasId, row, col, x, y) {
    var text = getKeyLetter(row, col);
    drawText(canvasId, text, x, y, keyFontSize, keyFontFamily)
}
function addWord() {
    if (gameState.selectedLetters.length == 0) {
        alert(messages[2]);
        return;
    }
    
    var word = $("#txtNewWord").val();
    if (gameState.userWords.includes(word)) {
        alert(messages[4]);
        return;
    }
    if (checkWord(word)) {
        if (!checkWordIsInDictionary(word))
        {
            alert(messages[3]);
            return;
        }
        gameState.addUserWord(word);
        var textareaVal = $('#txtUserWords').val();
        var rows = [];
        if (textareaVal == "")
        {
            $('#txtUserWords').val(word);
            rows.push(word);
        }
        else
        {
           
            rows = textareaVal.split("\n");
            rows.push(word);
            textareaVal = rows.sort().join("\n");
            $('#txtUserWords').val(textareaVal);            
        }
        $('#txtCountUserWords').val(rows.length);
        //clear input
        $("#txtNewWord").val("");
    }
    else
        alert(messages[1]);
}


