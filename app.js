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
    let winsCount = 0;
    return {name, mark, winsCount}
}

let Game = (function(){
    
    let currentTurn = 0;
    let moveCount = 0;
    //change tunr for player 0 or 1 
    function changeTurn(){
        currentTurn = currentTurn === 0? 1 : 0;
        return currentTurn;
    }
    //create 2 players with names
    function createPlayers(names){
        let player1Name = names[0];
        if (player1Name === ""){
            player1Name = "Player 1"
        }
        
        let player2Name = names[1];
        if (player2Name === ""){
            player2Name = "Player 2"
        }
        if (player1Name == player2Name){
            player1Name = player1Name +"(1)"
            player2Name = player2Name +"(2)"
        }
        const player1 = createPlayer(player1Name, "x");
        const player2 = createPlayer(player2Name, "o");
        console.info(`${player1.name} and ${player2.name} were created`)
        return [player1, player2]
    }
    //prompts for coordinates in a form of row,column(eg 0,1) and returns array [row column]
    function getCoordinates(board, clickedField){
        let row, column, position;
        
        position = clickedField.getAttribute("data-coordinates");
        [row, column] = position.split(',');
        row = Number(row);
        column = Number(column);
        
        if(!checkIfFieldIsEmpty(board, [row, column])){
            console.log("Field is not empty");
            return
        }

        
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
        if(moveCount === 9){
            return "Draw"
        }
        return false
    }

    function makeTurn(players, board, clickedField){
        console.log("making turn")
        let coordinates = getCoordinates(board, clickedField);
        if (!coordinates){
            return
        }
        console.log(`${players[currentTurn].name} selects column ${coordinates[0]} and row ${coordinates[1]}`);
        placeMark(board, players[currentTurn].mark, coordinates);
        Display.displayMark(clickedField, players[currentTurn].mark);
        moveCount++;
        let winner = Game.getWinnerMark(board);
        if(winner){
            Game.endGame(winner, players);
            return
        }
        changeTurn();
    }
    function resetCounters(){
        currentTurn = 0;
        moveCount = 0;
    }
    function endGame(winner, players){
        if (winner === "x"){
            players[0].winsCount++
            Display.displayWinner(players[0]);
            Display.refreshScore(players);
        }
        else if (winner === "o"){
            players[1].winsCount++
            Display.displayWinner(players[1]);
            Display.refreshScore(players);
        }
        else{
            Display.displayWinner();
        }
        resetCounters();
        Display.clearBoard();
        playGame(players);
    }
    return {
        createPlayers,
        currentTurn,
        changeTurn,
        getCoordinates,
        checkIfFieldIsEmpty,
        placeMark,
        makeTurn,
        getWinnerMark,
        resetCounters,
        endGame
    }
})()
function initiateGame(){
    console.log("Game started");
    let players = Game.createPlayers(Display.getNames());
    Display.displayName(players);
    Display.refreshScore(players);
    playGame(players);
}
function playGame(players){
    let board = createBoard();
    console.log(board);
    let winner = false;
    Display.removeBoard();
    Display.createBoard();
    let boardcells = document.querySelectorAll(".board-cell")
    boardcells.forEach((boardcell) => {
        boardcell.addEventListener("click", (event) => {

            Game.makeTurn(players, board, event.target);

        })
    })
}


let Display = (function(){
    function getNames(){
        const name1 = document.getElementById("player1name").value;
        const name2 = document.getElementById("player2name").value;
        return [name1, name2]
    }
    function displayMark(clickedField, mark){
        clickedField.textContent = mark;
    }
    function displayWinner(winner){
        let winnerDisplay = document.getElementById("summaryText")
        if (winner != undefined){
            winnerDisplay.textContent = `${winner.name} won!`;
        }
        else{
            winnerDisplay.textContent = `Draw!`;
        }
        
    }
    function clearBoard(){
        document.querySelectorAll(".board-cell").forEach(cell => cell.textContent = "");
    } 
    function createBoard(){
        const boardWrapper = document.getElementsByClassName("board-wrapper")[0];
        for (let i = 0; i < 3; i++){
            
            for(let j = 0; j < 3; j++){
                let newCell = document.createElement("div");
                newCell.className = "board-cell";
                newCell.setAttribute("data-coordinates", `${i},${j}`);
                boardWrapper.appendChild(newCell);
            }
        }
        
    }
    function removeBoard(){
        let boardcells = document.querySelectorAll(".board-cell");
        boardcells.forEach(element => element.remove())
    }
    function displayName(players){
        let player1Display = document.getElementById("player1display");
        let player2Display = document.getElementById("player2display");
        player1Display.textContent = players[0].name;
        player2Display.textContent = players[1].name;
    }
    function refreshScore(players){
        let player1scoreDisplay = document.getElementById("player1score");
        let player2scoreDisplay = document.getElementById("player2score");
        player1scoreDisplay.textContent = players[0].winsCount;
        player2scoreDisplay.textContent = players[1].winsCount;
    }
    return {
        getNames,
        displayMark,
        displayWinner,
        clearBoard,
        createBoard,
        removeBoard,
        displayName,
        refreshScore
    }
})()


initiateGame();
const startbtn = document.getElementById("start-button");
startbtn.addEventListener("click", (event) => {event.preventDefault(); initiateGame();})