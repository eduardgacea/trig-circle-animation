"use strict";

const posVector = document.getElementById("pos-vector");
const sinLine = document.getElementById("sin-line");
const cosLine = document.getElementById("cos-line");
const tanLine = document.getElementById("tan-line");
const ctanLine = document.getElementById("ctan-line");

const root = document.getElementById("root");
const canvas = document.getElementById("canvas");
const w = canvas.width;
const h = canvas.height;
const ctx = canvas.getContext("2d");

const r = 300;

function degToRad(deg) {
    return (Math.PI * deg) / 180;
}

function line(x1, y1, x2, y2, strokeWeight, strokeColor) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = strokeWeight;
    ctx.strokeStyle = strokeColor;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

function strokeCircle(x, y, r, strokeWeight, strokeColor, endAngle = 2 * Math.PI, dir = false, startAngle = 0) {
    ctx.save();
    ctx.lineWidth = strokeWeight;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(x, y, r, startAngle, endAngle, dir);
    ctx.stroke();
    ctx.restore();
}

function getLineEquation(xa, ya, xb, yb) {
    const slope = (ya - yb) / (xa - xb);
    const intercept = (xa * yb - xb * ya) / (xa - xb);
    return [slope, intercept];
}

function draw() {
    const theta = degToRad(document.getElementById("theta").value);
    const endArcX = w / 2 + r * Math.cos(theta);
    const endArcY = h / 2 - r * Math.sin(theta);
    const [slope, intercept] = getLineEquation(w / 2, h / 2, endArcX, endArcY);
    document.getElementById("theta-label").textContent = theta.toFixed(2);
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, w, h);
    line(w / 2, 0, w / 2, h, 4, "black");
    line(0, h / 2, w, h / 2, 4, "black");
    // DEFAULT FONT FORMAT
    ctx.font = "22px Arial";
    ctx.fillStyle = "green";
    // BLACK FULL CIRCLE
    strokeCircle(w / 2, h / 2, r, 4, "black");
    // RED ARC
    strokeCircle(w / 2, h / 2, r, 4, "red", -theta, true);
    // POINT
    strokeCircle(endArcX, endArcY, 4, 8, "red");
    // POSITION LINE
    if (posVector.checked) line(w / 2, h / 2, endArcX, endArcY, 4, "red");
    // SINE LINE
    if (sinLine.checked) line(endArcX, endArcY, endArcX, h / 2, 4, "blue");
    // COS LINE
    if (cosLine.checked) line(endArcX, endArcY, w / 2, endArcY, 4, "yellow");
    // CTAN
    if (ctanLine.checked) {
        const ctanX = (h - 2 * r - 2 * intercept) / (2 * slope);
        const ctanValue = (Math.cos(theta) / Math.sin(theta)).toFixed(2);
        line(0, h / 2 - r, w, h / 2 - r, 4, "black");

        if (theta > Math.PI) {
            line(endArcX, endArcY, ctanX, h / 2 - r, 4, "red");
        } else {
            line(w / 2, h / 2, ctanX, h / 2 - r, 4, "red");
        }

        if (ctanX < 0) {
            ctx.fillText(`${ctanValue}`, 10, h / 2 - r - 20);
        } else if (ctanX >= w - 50) {
            ctx.fillText(`${ctanValue}`, w - 70, h / 2 - r - 20);
        } else if (!ctanX) {
            ctx.fillText(`${ctanValue}`, w / 2, h / 2 - r - 20);
        } else {
            ctx.fillText(`${ctanValue}`, ctanX, h / 2 - r - 20);
        }
    }
    // TAN
    if (tanLine.checked) {
        const tanX = w / 2 + r;
        const tanY = slope * tanX + intercept;
        const tanValue = (Math.sin(theta) / Math.cos(theta)).toFixed(2);
        line(tanX, 0, tanX, h, 4, "black");

        if (theta > Math.PI / 2 && theta < Math.PI * (3 / 2)) {
            line(endArcX, endArcY, tanX, tanY, 4, "red");
        } else {
            line(w / 2, h / 2, tanX, tanY, 4, "red");
        }

        if (tanY <= 30) {
            ctx.fillText(`${tanValue}`, tanX + 10, 20);
        } else if (tanY > h) {
            ctx.fillText(`${tanValue}`, tanX + 10, h - 10);
        } else {
            ctx.fillText(`${tanValue}`, tanX + 10, tanY - 20);
        }
    }
    // COORDINATES
    ctx.fillStyle = "red";
    ctx.fillText(`(${Math.cos(theta).toFixed(2)} ; ${Math.sin(theta).toFixed(2)})`, endArcX - 120, endArcY - 20);

    setTimeout(() => {
        requestAnimationFrame(draw);
    }, 10);
}

draw();
