class GameState {
    constructor() {
        this.all_words = [];
        //letters of user choice that should contain valid word
        this.selectedLetters = [];
        //array of valid words from array of all words
        this.validWords = [];
        //words that an user found
        this.userWords = [];
        this.currentWord = "";
    }
    addSelectedLetter(letter)
    {
        this.selectedLetters.push(letter);
    }
    addUserWord(word)
    {
        this.userWords.push(word);
    }
}