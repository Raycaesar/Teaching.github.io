// Canvas Setup
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Initial Variable Declarations
let isDrawing = false;
let isTextToolActive = false;
let points = [];
let color = '#000000';

// Canvas Event Listeners
canvas.addEventListener("mousedown", () => {
    if (!isTextToolActive) {
        isDrawing = true;
        points.push({type: 'path', color: color, points: []});
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("click", (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    if (isTextToolActive && !isDrawing) {
        const text = prompt("Enter text:");
        ctx.font = `${fontSize}px ${selectedFont}`;
        ctx.fillText(text, mouseX, mouseY);
        points.push({type: 'text', color: color, text: text, x: mouseX, y: mouseY, font: ctx.font});
    }
});

document.getElementById("textTool").addEventListener("click", () => {
    isTextToolActive = !isTextToolActive;  // Toggle text tool activation

    // Toggle button appearance for feedback
    if (isTextToolActive) {
        document.getElementById("textTool").style.backgroundColor = "#ccc";  // Set to any color you like
    } else {
        document.getElementById("textTool").style.backgroundColor = "";  // Reset to default color or style
    }
});


function draw(event) {
    if (!isDrawing || isTextToolActive) return;

    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    points[points.length - 1].points.push({ x: mouseX, y: mouseY });
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
}

function generateSVG() {
    let svgStr = `<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">`;
    points.forEach(item => {
        switch(item.type) {
            case 'path':
                svgStr += `<path d='M${item.points.map(point => `${point.x} ${point.y}`).join(" L")}' stroke='${item.color}' fill='none' stroke-width='5'/>`;
                break;
            case 'text':
                svgStr += `<text x='${item.x}' y='${item.y}' fill='${item.color}' font='${item.font}'>${item.text}</text>`;
                break;
        }
    });
    svgStr += "</svg>";
    document.getElementById("svgOutput").innerHTML = svgStr;
}

function downloadSVG() {
    const svgText = document.getElementById("svgOutput").innerHTML;
    const blob = new Blob([svgText], {type: "image/svg+xml"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.svg";
    a.click();
}

document.getElementById("colorPicker").addEventListener("input", (event) => {
    color = event.target.value;
});

document.getElementById("generateSVG").addEventListener("click", generateSVG);
document.getElementById("downloadSVG").addEventListener("click", downloadSVG);
document.getElementById("fontSelector").addEventListener("change", (event) => {
    selectedFont = event.target.value;
});

document.getElementById("fontSize").addEventListener("input", (event) => {
    fontSize = event.target.value;
});

let fontSize = 16;
let selectedFont = 'Arial';

