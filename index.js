/**
 * Parabolic Motion
 *
 * @author Afaan Bilal
 * @link https://afaan.dev/parabolic-motion
 */

const canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

const frameRate = 30;
const intervalMs = Math.floor(1000 / frameRate);

const toRad = (angle) => angle * (Math.PI / 180);
const g = 9.8;
const xOffset = 30;
const yOffset = 600;
const textOffset = 20;
const radius = 10;

let frame = 0;
let intervalHandle = null;
const setupInterval = () => { intervalHandle = setInterval(tick, intervalMs); };
const removeInterval = () => { if (!intervalHandle) return; clearInterval(intervalHandle); intervalHandle = null; };

const drawAxis = () => {
    ctx.beginPath();
    ctx.moveTo(xOffset, yOffset);
    ctx.lineTo(canvas.width - xOffset, yOffset);
    ctx.stroke();

    for (let i = 0; i <= 900; i += 50) {
        ctx.fillText(i, xOffset + i, yOffset + textOffset);
    }

    ctx.beginPath();
    ctx.moveTo(xOffset, yOffset);
    ctx.lineTo(xOffset, canvas.height - yOffset);
    ctx.stroke();

    for (let i = yOffset; i >= canvas.height - yOffset; i -= 50) {
        ctx.fillText(i, xOffset - textOffset, yOffset - i);
    }
};

const drawCircle = (x, y) => {
    ctx.moveTo(x, y);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

const drawPath = () => {
    let px = 0;
    let py = 0;

    for (let i = 0; i <= frame; i++) {
        let t = tCoordinate(i); // t in seconds

        x = xCoordinate(t);
        y = yCoordinate(t);

        if (!px) px = x;
        if (!py) py = y;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();

        px = x;
        py = y;
    }
};

const drawVertical = (x) => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
};

const drawHorizontal = (y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
};

const btnStart = document.getElementById("start");
const btnPause = document.getElementById("pause_resume");
const btnReset = document.getElementById("reset");

const iH = document.getElementById("ih");
const iV = document.getElementById("iv");
const iA = document.getElementById("ia");

const sP = document.getElementById("sp");
const sH = document.getElementById("sh");
const sV = document.getElementById("sv");

const reset = () => {
    removeInterval();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxis();
    drawCircle(xOffset, yOffset);
    frame = 0;
    btnStart.removeAttribute("disabled");
    btnPause.setAttribute("disabled", "disabled");
    btnReset.setAttribute("disabled", "disabled");
    iH.removeAttribute("disabled");
    iV.removeAttribute("disabled");
    iA.removeAttribute("disabled");
    sH.removeAttribute("disabled");
    sV.removeAttribute("disabled");
};

reset();

let ih = 0; // initial height
let iv = 0; // initial velocity (m/s)
let ia = 0; // launch angle (degrees)

let sp = false; // show path
let sh = false; // show horizontal
let sv = false; // show vertical

let a = 0;
let vCos = 0;
let vSin = 0;

const tCoordinate = (frame) => frame * intervalMs / 1000;
const xCoordinate = (t) => xOffset + vCos * t;
const yCoordinate = (t) => yOffset - ih - (vSin * t - g * t * t / 2);

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let t = tCoordinate(frame); // t in seconds

    x = xCoordinate(t);
    y = yCoordinate(t);

    drawCircle(x, y);
    sp && drawPath();
    sh && drawHorizontal(y);
    sv && drawVertical(x);
    drawAxis();

    if (y >= yOffset && frame > 0) {
        frame = 0;
        removeInterval();
    }
};

const tick = () => { draw(); frame++; };

btnStart.addEventListener("click", () => {
    if (intervalHandle) return;

    ih = iH.value;
    iv = iV.value;
    ia = iA.value;

    sp = sP.checked;
    sh = sH.checked;
    sv = sV.checked;

    a = toRad(ia);
    vCos = iv * Math.cos(a);
    vSin = iv * Math.sin(a);

    setupInterval();

    btnStart.setAttribute("disabled", "disabled");
    btnPause.removeAttribute("disabled");
    btnReset.removeAttribute("disabled");
    iH.setAttribute("disabled", "disabled");
    iV.setAttribute("disabled", "disabled");
    iA.setAttribute("disabled", "disabled");
    sH.setAttribute("disabled", "disabled");
    sV.setAttribute("disabled", "disabled");
});

btnPause.addEventListener("click", () => {
    if (intervalHandle) {
        removeInterval();
        document.getElementById("pause_resume").textContent = "Resume";
    } else {
        setupInterval();
        document.getElementById("pause_resume").textContent = "Pause";
    }
});

btnReset.addEventListener("click", () => {
    reset();
});
