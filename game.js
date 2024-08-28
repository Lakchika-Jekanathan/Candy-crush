var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];

var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var currentTile;
var otherTile;

window.onload = function() {
    startGame();

    window.setInterval(function() {
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./Image/" + randomCandy() + ".png";

            // Drag events
            tile.addEventListener("dragstart", dragstart);
            tile.addEventListener("dragover", dragover);
            tile.addEventListener("dragenter", dragenter);
            tile.addEventListener("dragleave", dragleave);
            tile.addEventListener("dragend", dragend);
            tile.addEventListener("drop", dragdrop);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function dragstart() {
    currentTile = this;
}

function dragover(e) {
    e.preventDefault();
}

function dragenter(e) {
    e.preventDefault();
}

function dragleave() {
    // Optional: handle when dragging leaves a tile
}

function dragdrop() {
    otherTile = this;
}

function dragend() {
    if(currentTile.src.includes("blank") || otherTile.src.includes("blank")){
        return;
    }

    let currentCoords = currentTile.id.split("-");
    let r = parseInt(currentCoords[0]);
    let c = parseInt(currentCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;
    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        // Swap the images
        let currentImage = currentTile.src;
        let otherImage = otherTile.src;
        currentTile.src = otherImage;
        otherTile.src = currentImage;

        // Check if the move is valid (i.e., it results in a crush)
        let validMove = checkValid();
        if (!validMove) {
            // Swap back if the move is not valid
            currentTile.src = currentImage;
            otherTile.src = otherImage;
        } else {
            // Move is valid; crush candies if applicable
            crushCandy();
        }
    }
}

function crushCandy() {
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    // Horizontal crush
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {  // Ensure c+2 doesn't exceed boundary
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./Image/blank.png";
                candy2.src = "./Image/blank.png";
                candy3.src = "./Image/blank.png";
                score += 60;
            }
        }
    }

    // Vertical crush
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {  // Ensure r+2 doesn't exceed boundary
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./Image/blank.png";
                candy2.src = "./Image/blank.png";
                candy3.src = "./Image/blank.png";
                score += 60;
            }
        }
    }
}

function checkValid() {
    // Horizontal crush
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {  // Ensure c+2 doesn't exceed boundary
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    // Vertical crush
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {  // Ensure r+2 doesn't exceed boundary
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let index = rows - 1; // Start from the bottom of the column

        for (let r = rows - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) { // If the candy is not blank
                board[index][c].src = board[r][c].src; // Move the candy down
                index--; // Move the index up
            }
        }

        // Fill remaining blanks with blanks
        for (let r = index; r >= 0; r--) {
            board[r][c].src = "./Image/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[r][c].src.includes("blank")) {
                board[r][c].src = "./Image/" + randomCandy() + ".png";
            }
        }
    }
}
