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
const xOffset = 10;
const yOffset = 580;
const radius = 10;

let frame = 0;

let i = null;
const setupInterval = () => { i = setInterval(tick, intervalMs); };
const removeInterval = () => { if (!i) return; clearInterval(i); i = null; };

const drawBaseline = () => {
    ctx.beginPath();
    ctx.moveTo(xOffset, yOffset);
    ctx.lineTo(canvas.width - xOffset, yOffset);
    ctx.stroke();
};

const drawCircle = (x, y) => {
    ctx.moveTo(x, y);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

const reset = () => {
    removeInterval();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBaseline();
    drawCircle(xOffset + radius, yOffset - radius);
    frame = 0;
};

reset();

let iv = 0; // initial velocity (m/s)
let ia = 0; // launch angle (degrees)

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let t = frame * intervalMs / 1000; // t in seconds

    const a = toRad(ia);
    const vCos = iv * Math.cos(a);
    const vSin = iv * Math.sin(a);

    x = xOffset + radius + vCos * t;
    y = yOffset - radius - (vSin * t - g * t * t / 2);

    drawCircle(x, y);
    drawBaseline();

    if (y + radius >= yOffset && frame > 0) {
        frame = 0;
        removeInterval();
    }
};

const tick = () => {
    draw();
    frame++;
    if (frame > 1000) frame = 0;
};

document.getElementById("start").addEventListener("click", () => {
    if (i) return;
    iv = document.getElementById("iv").value;
    ia = document.getElementById("ia").value;
    setupInterval();
});

document.getElementById("pause_resume").addEventListener("click", () => {
    if (i) {
        removeInterval();
        document.getElementById("pause_resume").textContent = "Resume";
    } else {
        setupInterval();
        document.getElementById("pause_resume").textContent = "Pause";
    }
});

document.getElementById("reset").addEventListener("click", () => {
    reset();
});
