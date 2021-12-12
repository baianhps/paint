let cursorX = (e) => e.clientX - bound.left;
let cursorY = (e) => e.clientY - bound.top;

class Point {
    constructor(x, y) { this.update(x, y) }
    update(x, y) { this.x = x; this.y = y; }
    toString() { return this.x + ' , ' + this.y }
}


let svg = document.querySelector('svg');
let bound = svg.getBoundingClientRect();
let show = document.getElementById('pos');
let cursorPosition = new Point(0, 0);
let selected = 'pointer';
let mouseIsDown = false;
let mouseDownX, mousedownY;
let drawing;


function mouseDownHandler(e) {
    mouseIsDown = true;
    mouseDownX = cursorX(e), mousedownY = cursorY(e);
    if (selected === 'line') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "line");
        drawing.setAttribute("x1", mouseDownX);
        drawing.setAttribute("y1", mousedownY);
        drawing.setAttribute("x2", mouseDownX);
        drawing.setAttribute("y2", mousedownY);
        drawing.setAttribute("stroke", getBorderColor());
        drawing.setAttribute("stroke-width", getBorderWidth());
        svg.appendChild(drawing)
    } else if (selected === 'rectangle') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        drawing.setAttribute("x", mouseDownX);
        drawing.setAttribute("y", mousedownY);
        drawing.setAttribute("width", 0);
        drawing.setAttribute("height", 0);
        drawing.setAttribute("stroke", getBorderColor());
        drawing.setAttribute("stroke-width", getBorderWidth());
        drawing.setAttribute("fill", getFillColor());
        svg.appendChild(drawing)
    } else if (selected === 'ellipse') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        drawing.setAttribute("cx", mouseDownX);
        drawing.setAttribute("cy", mousedownY);
        drawing.setAttribute("stroke", getBorderColor());
        drawing.setAttribute("stroke-width", getBorderWidth());
        drawing.setAttribute("fill", getFillColor());
        svg.appendChild(drawing)

    } else if (selected === 'circle') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        drawing.setAttribute("cx", mouseDownX);
        drawing.setAttribute("cy", mousedownY);
        drawing.setAttribute("stroke", getBorderColor());
        drawing.setAttribute("stroke-width", getBorderWidth());
        drawing.setAttribute("fill", getFillColor());
        svg.appendChild(drawing)
    } else if (selected === 'text') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "text");
        drawing.setAttribute("x", mouseDownX);
        drawing.setAttribute("y", mousedownY + getTextSize());
        drawing.setAttribute("font-size", getTextSizeString());
        drawing.setAttribute("stroke", getBorderColor());
        drawing.setAttribute("stroke-width", getBorderWidth());
        drawing.setAttribute("fill", getFillColor());
        drawing.innerHTML = getTextContent()
        svg.appendChild(drawing)

    }
}

function mouseMoveHandler(e) {
    cursorPosition.update(cursorX(e), cursorY(e));
    show.innerHTML = cursorPosition.toString();
    if (mouseIsDown) {
        if (selected === 'line') {
            drawing.setAttribute("x2", cursorX(e));
            drawing.setAttribute("y2", cursorY(e));
        } else if (selected === 'rectangle') {
            let width = cursorX(e) - mouseDownX, height = cursorY(e) - mousedownY;
            if (width >= 0) {
                drawing.setAttribute("x", mouseDownX);
                drawing.setAttribute("width", width);
            } else {
                drawing.setAttribute("x", cursorX(e));
                drawing.setAttribute("width", Math.abs(width));
            }
            if (height >= 0) {
                drawing.setAttribute("y", mousedownY);
                drawing.setAttribute("height", height);
            } else {
                drawing.setAttribute("y", cursorY(e));
                drawing.setAttribute("height", Math.abs(height));
            }
        } else if (selected === 'ellipse') {
            drawing.setAttribute("cx", (mouseDownX + cursorX(e)) / 2);
            drawing.setAttribute("cy", (mousedownY + cursorY(e)) / 2);
            drawing.setAttribute("rx", Math.abs(cursorX(e) - mouseDownX) / 2);
            drawing.setAttribute("ry", Math.abs(cursorY(e) - mousedownY) / 2);
        } else if (selected === 'circle') {
            drawing.setAttribute("r", Math.hypot(cursorX(e) - mouseDownX, cursorY(e) - mousedownY));
        } else if (selected === 'text') {


        }

    }
}

function mouseUpHandler(e) {
    mouseIsDown = false;
   
}

function getBorderColor() {
    if (document.getElementById('no-border').checked) { return 'transparent' }
    else { return document.getElementById('border-picker').value; }
}
function getFillColor() {
    if (document.getElementById('no-fill').checked) { return 'transparent' }
    else { return document.getElementById('fill-picker').value; }
}
function getBorderWidth() {
    return document.getElementById('border-width').value
}
function getTextContent() {
    return document.getElementById('text-content').value
}
function getTextSize() {
    return Number(document.getElementById('text-size').value)
}
function getTextSizeString() {
    return getTextSize() + 'px'
}


window.addEventListener('resize', (e) => {
    bound = svg.getBoundingClientRect();

})

svg.addEventListener('mousedown', mouseDownHandler);
svg.addEventListener('mousemove', mouseMoveHandler);
svg.addEventListener('mouseup', mouseUpHandler);

document.querySelectorAll('.toolbar>a').forEach((element) => {
    if (element.id === 'image') {
        // TODO
        // open image
    } else {
        element.addEventListener('click', (event) => {
            selected = element.id;
            document.querySelector('.selected').classList.remove('selected');
            element.classList.add('selected');
        })

    }
});
document.getElementById('border-picker').addEventListener('change', (e) => {
    document.getElementById('border-hex').innerText = e.originalTarget.value.toUpperCase();
});
document.getElementById('fill-picker').addEventListener('change', (e) => {
    document.getElementById('fill-hex').innerText = e.originalTarget.value.toUpperCase();
});
