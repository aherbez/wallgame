const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

let boardState = [null, null, null,null, null, null,null, null, null];

let player = 'X';

const sendMsg = (msg) => {
    console.log('sendMsg', msg);
    window.parent.postMessage(msg, '*');
}

const eventToPosition = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {x, y};
}

const reset = () => {
    boardState = [null, null, null,null, null, null,null, null, null];
    player = 'X';
}

const drawX = () => {
    ctx.save();

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width / 3, height / 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 3, 0);
    ctx.lineTo(0, height / 3);
    ctx.stroke();

    ctx.restore();
}

const drawO = () => {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(width / 6, height / 6, width / 6, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.restore();
}

const checkWin = () => {
    // console.log(boardState);

    for (let i=0; i < 3; i++) {
        // horizontal wins
        if (!!boardState[i*3] &&
            boardState[i*3] === boardState[i*3 + 1] &&
            boardState[i*3] === boardState[i*3 + 2]) {
            return boardState[i*3];
        }

        console.log(`checking ${i} ${i+3} ${i+6}`);
        // vertical wins
        if (!!boardState[i] &&
            boardState[i] === boardState[i + 3] &&
            boardState[i] === boardState[i + 6]) {
            return boardState[i];
        }

        // diagonal wins
        if (!!boardState[0] &&
            boardState[0] === boardState[4] &&
            boardState[0] === boardState[8]) {
            return boardState[0];
        }
        if (!!boardState[2] &&
            boardState[2] === boardState[4] &&
            boardState[2] === boardState[6]) {
            return boardState[2];
        }
    }
    return null;
}

const drawCell = (i) => {
    const x = i % 3;
    const y = Math.floor(i / 3);

    const state = boardState[i];

    ctx.save();

    ctx.translate(x * width / 3, y * height / 3);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width / 3, height / 3);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width / 3, height / 3);

    if (state === 'X') {
        drawX();
    }
    else if (state === 'O') {
        drawO();
    }

    ctx.restore();
}

const render = () => {

    ctx.save();

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'slategray';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);

    ctx.restore();

    for (let i=0; i<9; i++) {
        drawCell(i);
    }

    requestAnimationFrame(render);
}

const onClick = (e) => {
    if (player === null) {
        reset();
        sendMsg({reset: true});
        return;
    }


    const pos = eventToPosition(e);

    const x = Math.floor(pos.x / (width / 3));
    const y = Math.floor(pos.y / (height / 3));
    const index = x + y * 3;


    if (!boardState[index]) {
        boardState[index] = player;
        if (player === 'X') {
            player = 'O';
        } else {
            player = 'X';
        }
    }


    // sendMsg(`set ${index} ${boardState[index]}`);

    const winner = checkWin();
    console.log(`winner: ${winner}`);
    if (!!winner) {
        sendMsg({winner});
        player = null;
    }
}

const init = () => {
    render();

    canvas.addEventListener('click', onClick);

}

init();