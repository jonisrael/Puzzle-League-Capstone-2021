
// import fs module in which writeFile function is defined.
const fsLibrary  = require('fs')

// File locations to access folders
const CYAN = "PuzzleLeagueFiles/Sprites/cyanStar/"
const GREEN = "PuzzleLeagueFiles/Sprites/greenCircle/"
const PURPLE = "PuzzleLeagueFiles/Sprites/purpleDiamond/"
const RED = "PuzzleLeagueFiles/Sprites/redHeart/"
const YELLOW = "PuzzleLeagueFiles/Sprites/yellowLightning/"
const BLUE = "PuzzleLeagueFiles/Sprites/blueTriangle/"
const VACANT = "PuzzleLeagueFiles/Sprites/vacantSquare/"

const NORMAL = "normal.png"
const FACE = "face.png"
const DARK = "dark.png"
const DEATH = "death.png"
const CLEARING = "clearing/"
const PANICKING = "panicking/"
const LANDING = "landing/"

const COLS = 6;
const ROWS = 12;

const PIECES = [CYAN, GREEN, PURPLE, RED, YELLOW, BLUE];


class Block {
    constructor(x,y,color,type, delay, 
                touched = false, availableForPrimaryChain = false, availableForSecondaryChain = false) {
        this.x = x
        this.y = y
        this.color = color
        this.type = type
        this.delay = delay
        this.touched = touched
        this.availableForPrimaryChain = availableForPrimaryChain // When disappear, chain ends
        this.availableForSecondaryChain = availableForSecondaryChain
    }
}

let data = []
let databaseString = ``
for (let index=0; index<1440; index++) {
    let board = []
    let boardInformation = []
    let boardString = `[`
    for(let c=0; c<COLS; c++){
        board.push([]);
        for (let r=0; r<ROWS+2; r++){
            let block = new Block(c,r,VACANT, NORMAL, 0)
            board[c].push(block)
            if (r>11) {
                board[c][r].color = PIECES[Math.floor(Math.random() * PIECES.length)]
                board[c][r].type = DARK
            }
        }
    }

    for (let i=0; i<30; i++) {  // Generate 30 random blocks on bottom 6 rows.
        while(true){
            let x = Math.floor(Math.random() * COLS)
            let y = Math.floor(Math.random() * 6 + 6)
            if (board[x][y].color == VACANT){
                board[x][y].color = PIECES[Math.floor(Math.random() * PIECES.length)]
                break
            }
        }
    }

    for (let c=0; c<COLS; c++) {    // Drop all blocks to bottom
        let currentBlocks = [] // Temporary 
        for (let r=ROWS-1; r>=0; r--) {
            if (board[c][r].color != VACANT) {
                currentBlocks.unshift(board[c][r].color)
            }
        }
        while (currentBlocks.length < 12) {
            currentBlocks.unshift(VACANT)
        }

        for (let r=0; r<currentBlocks.length; r++){
            board[c][r].color = currentBlocks[r]
        }
    }

    for (let x=0; x<COLS; x++) { // Correct Duplicates so blocks of same color cannot be adjacent
        for (let y=0; y<ROWS; y++) {
            if (board[x][y].color != VACANT) {
                let topBlock = rightBlock = bottomBlock = leftBlock = VACANT
                if (y!= 0) {topBlock = board[x][y-1].color}
                if (x!= 5) {rightBlock = board[x+1][y].color}
                if (y!=11) {bottomBlock = board[x][y+1].color}
                if (x!= 0) {leftBlock = board[x-1][y].color}

                while (true) {
                    if (board[x][y].color != topBlock &&
                        board[x][y].color != rightBlock &&
                        board[x][y].color != bottomBlock &&
                        board[x][y].color != leftBlock) {
                            break
                        }
                    board[x][y].color = PIECES[Math.floor(Math.random() * PIECES.length)]
                }
            }
        }
    }

    for (let x=0; x<COLS; x++) { // Initial Dark Stacks
        board[x][12].color = PIECES[Math.floor(Math.random() * PIECES.length)]
        board[x][13].color = PIECES[Math.floor(Math.random() * PIECES.length)]
        if(x>0){
            while(board[x][12].color==board[x-1][12].color){
                board[x][12].color = PIECES[Math.floor(Math.random() * PIECES.length)]
            }
            while(board[x][13].color==board[x-1][13].color){
                board[x][13].color = PIECES[Math.floor(Math.random() * PIECES.length)]
            }
        }
    }

    // fix dark stacks
    let aboveAdjacent = true
    let leftRightAdjacent = true
    let tempPIECES = PIECES.slice()
    while(aboveAdjacent || leftRightAdjacent) {
        aboveAdjacent = leftRightAdjacent = false
        for (let c=0; c<COLS; c++) {
            tempPIECES = PIECES.slice()
            tempPIECES.splice(tempPIECES.indexOf(board[c][12].color), 1)
            if (board[c][13].color == board[c][12].color) {
                aboveAdjacent = true
            }
            if (c==0) {
                if (board[c][13].color == board[c+1][13].color) {
                    leftRightAdjacent = true
                }
            } else if (c>0 && c<5) {
                if (board[c-1][13].color == board[c][13].color &&
                    board[c][13].color == board[c+1][13].color) {
                    leftRightAdjacent = true
                }
            } else if (c==5) {
                if (board[c-1][13].color == board[c][13].color) {
                    leftRightAdjacent = true
                }
            }

            if (aboveAdjacent || leftRightAdjacent) {
                board[c][13].color = PIECES[Math.floor(Math.random() * PIECES.length)]
            }
        }
    }

    let boardEntry = []
    for (let c=0; c<COLS; c++) {
        boardEntry.push([])
        for (let r=0; r<ROWS+2; r++) {
            boardEntry[c].push({
                "x": c,
                "y" : r,
                "color" : board[c][r].color,
                "type" : board[c][r].type
            })
        }
    }
    data.push(boardEntry)
}
console.log(data)

// console.log(fs)
fsLibrary.writeFile('database.json', JSON.stringify(data), (error) => {
    // In case of a error throw err exception.
    if (error) throw err;
})