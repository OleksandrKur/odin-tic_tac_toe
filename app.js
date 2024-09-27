function createBoard(){

    const board = [
        [[""],[""],[""]],
        [[""],[""],[""]],
        [[""],[""],[""]]
    ];
    const lines = [
        [board[0][0], board[0][1], board[0][2]], // horizontal 1
        [board[1][0], board[1][1], board[1][2]], // horizontal 2
        [board[2][0], board[2][1], board[2][2]], // horizontal 3
        [board[0][0], board[1][0], board[2][0]], // vertical 1
        [board[0][1], board[1][1], board[2][1]], // vertical 2
        [board[0][2], board[1][2], board[2][2]], // vertical 3
        [board[0][0], board[1][1], board[2][2]], // diagonal 1
        [board[0][2], board[1][1], board[2][0]]  // diagonal 2
    ];
    return {board, lines};
}

function createPlayer(name, mark){

    return {name, mark}
}

let Game = (function(){
    //tracker of turn returns either 1 or 2
    let currentTurn = 0;
    function changeTurn(){
        currentTurn = currentTurn === 0? 1 : 0;
        return currentTurn;
    }
    //create 2 players with names
    function createPlayers(){
        let player1Name = prompt("select name for player 1");
        if (player1Name === ""){
            player1Name = "Player 1"
        }
        
        let player2Name = prompt("select name for player 2");
        if (player2Name === ""){
            player1Name = "Player 2"
        }
        if (player1Name == player2Name){
            player1Name = player1Name +"(1)"
            player2Name = player2Name +"(2)"
        }
        const player1 = createPlayer(player1Name, "x");
        const player2 = createPlayer(player2Name, "o");
        console.log(player1);
        console.log(player2);
        return [player1, player2]
    }
    //prompts for coordinates in a form of row,column(eg 0,1) and returns array [row column]
    function getCoordinates(board, player){
        let row, column;
        do{
            let position = prompt(`${player.name} select cell(0,1 ... 2,2)`);

            try{
                [row, column] = position.split(',');
                row = Number(row);
                column = Number(column);
            }catch (error) {
                alert("Please enter correct position");
                continue;
            }

        }
        while(!((row >= 0 && row < 3) && (column >= 0 && column < 3) && checkIfFieldIsEmpty(board, [row, column])))
        return [row, column]
        //TODO Check if input is valid
    }
    //returns true if field is empty
    function checkIfFieldIsEmpty(board, coordinates){
        if (board.board[coordinates[0]][coordinates[1]][0] === ""){
          return true;
        }
        return false;
    }
    //places mark on given field
    function placeMark(board, mark, coordinates){
        board.board[coordinates[0]][coordinates[1]][0] = mark;
    }
    //checks possible lines
    function getWinnerMark(board){
        const isSame = (currentValue, index, array) => currentValue[0] === array[0][0] && currentValue[0] !== "";
    
        for(let i = 0; i < board.lines.length; i++){
            if (board.lines[i].every(isSame)){
                return board.lines[i][0][0];
            }
        }
        return false
    }
    function makeTurn(players, board){
        let coordinates = getCoordinates(board, players[currentTurn]);
        console.log(`${players[currentTurn].name} selects column ${coordinates[0]} and row${coordinates[1]}`);
        placeMark(board, players[currentTurn].mark, coordinates);
        console.log(board.board);
        changeTurn();
    }
    return {
        createPlayers,
        currentTurn,
        changeTurn,
        getCoordinates,
        checkIfFieldIsEmpty,
        placeMark,
        makeTurn,
        getWinnerMark
    }
})()
function initiateGame(){
    let board = createBoard();
    let players = Game.createPlayers();
    let winner = false;

    do{
        Game.makeTurn(players, board);
        winner = Game.getWinnerMark(board);
    }
    while(!winner)
    alert(winner);
}

initiateGame();



