class Point {
    constructor(x, y) { this.update(x, y) }
    update(x, y) { this.x = x; this.y = y; }
    toString() { return this.x + ' , ' + this.y }
}

let svg = document.querySelector('svg');
let bound = svg.getBoundingClientRect();
let cursorX = (e) => e.clientX - bound.left;
let cursorY = (e) => e.clientY - bound.top;
let show = document.getElementById('pos');
let cursorPosition = new Point(0, 0);
let mouseDownLoc = new Point(0, 0);
let selected = document.querySelector('.selected').id;
let mouseIsDown = false;
let drawing = undefined;
let layer = document.getElementById('layer');


function mouseDown(e) {
    mouseIsDown = true;
    mouseDownLoc.update(cursorX(e), cursorY(e));
    if (selected === 'line') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "line");
        drawing.setAttribute("x1", mouseDownLoc.x);
        drawing.setAttribute("y1", mouseDownLoc.y);
        drawing.setAttribute("x2", mouseDownLoc.x);
        drawing.setAttribute("y2", mouseDownLoc.y);
        setBorder();
        svg.appendChild(drawing)
    } else if (selected === 'rectangle') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        drawing.setAttribute("x", mouseDownLoc.x);
        drawing.setAttribute("y", mouseDownLoc.y);
        drawing.setAttribute("width", 0);
        drawing.setAttribute("height", 0);
        setBorder();
        setFill();
        svg.appendChild(drawing)
    } else if (selected === 'ellipse') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        drawing.setAttribute("cx", mouseDownLoc.x);
        drawing.setAttribute("cy", mouseDownLoc.y);
        setBorder();
        setFill();
        svg.appendChild(drawing)
    } else if (selected === 'circle') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        drawing.setAttribute("cx", mouseDownLoc.x);
        drawing.setAttribute("cy", mouseDownLoc.y);
        setBorder();
        setFill();
        svg.appendChild(drawing)
    } else if (selected === 'text') {
        drawing = document.createElementNS("http://www.w3.org/2000/svg", "text");
        drawing.setAttribute("x", mouseDownLoc.x);
        drawing.setAttribute("y", mouseDownLoc.y + getTextSize());
        setBorder();
        setFill();
        setText();
        svg.appendChild(drawing)
    }
}

function mouseMove(e) {
    cursorPosition.update(cursorX(e), cursorY(e));
    show.innerHTML = cursorPosition.toString();
    if (mouseIsDown) {
        if (selected === 'line') {
            drawing.setAttribute("x2", cursorX(e));
            drawing.setAttribute("y2", cursorY(e));
        } else if (selected === 'rectangle') {
            let width = cursorX(e) - mouseDownLoc.x, height = cursorY(e) - mouseDownLoc.y;
            if (width >= 0) {
                drawing.setAttribute("x", mouseDownLoc.x);
                drawing.setAttribute("width", width);
            } else {
                drawing.setAttribute("x", cursorX(e));
                drawing.setAttribute("width", Math.abs(width));
            }
            if (height >= 0) {
                drawing.setAttribute("y", mouseDownLoc.y);
                drawing.setAttribute("height", height);
            } else {
                drawing.setAttribute("y", cursorY(e));
                drawing.setAttribute("height", Math.abs(height));
            }
        } else if (selected === 'ellipse') {
            drawing.setAttribute("cx", (mouseDownLoc.x + cursorX(e)) / 2);
            drawing.setAttribute("cy", (mouseDownLoc.y + cursorY(e)) / 2);
            drawing.setAttribute("rx", Math.abs(cursorX(e) - mouseDownLoc.x) / 2);
            drawing.setAttribute("ry", Math.abs(cursorY(e) - mouseDownLoc.y) / 2);
        } else if (selected === 'circle') {
            drawing.setAttribute("r", Math.hypot(cursorX(e) - mouseDownLoc.x, cursorY(e) - mouseDownLoc.y));
        } else if (selected === 'pointer') {
            if (typeof (drawing) !== 'undefined') {
                if (drawing.tagName === 'line') {
                    let x1 = Number(drawing.getAttribute('x1')), x2 = Number(drawing.getAttribute('x2'));
                    let y1 = Number(drawing.getAttribute('y1')), y2 = Number(drawing.getAttribute('y2'));
                    if (x1 + e.movementX >= 0) {
                        drawing.setAttribute('x1', x1 + e.movementX);
                        drawing.setAttribute('x2', x2 + e.movementX);
                    }
                    if (y1 + e.movementY >= 0) {
                        drawing.setAttribute('y1', y1 + e.movementY);
                        drawing.setAttribute('y2', y2 + e.movementY);
                    }
                } else if (drawing.tagName === 'ellipse' || drawing.tagName === 'circle') {
                    let cx = Number(drawing.getAttribute('cx')), cy = Number(drawing.getAttribute('cy'));
                    if (cx + e.movementX >= 0) { drawing.setAttribute('cx', cx + e.movementX); }
                    if (cy + e.movementY >= 0) { drawing.setAttribute('cy', cy + e.movementY); }
                } else {
                    let x = Number(drawing.getAttribute('x')), y = Number(drawing.getAttribute('y'));
                    if (x + e.movementX >= 0) { drawing.setAttribute('x', x + e.movementX); }
                    if (y + e.movementY >= 0) { drawing.setAttribute('y', y + e.movementY); }
                }
            }
        }
    }
}

function mouseUp(e) {
    mouseIsDown = false;
    refreshLayerList();
}

function refreshLayerList() {
    document.getElementById('layer').clearChildren()
    for (let i = svg.childElementCount - 1; i >= 0; i--) {
        let o = document.createElement('option');
        let t = svg.children[i]
        o.innerText = t.tagName;
        o.setAttribute('value', i);
        layer.appendChild(o)
    }
}

function getBorderColor() {
    if (document.getElementById('no-border').checked) { return 'transparent' }
    else { return document.getElementById('border-picker').value; }
}
function getFillColor() {
    if (document.getElementById('no-fill').checked) { return 'transparent' }
    else { return document.getElementById('fill-picker').value; }
}
function getBorderWidth() { return document.getElementById('border-width').value }
function getTextContent() { return document.getElementById('text-content').value }
function getTextSize() { return Number(document.getElementById('text-size').value) }
function getTextSizeString() { return getTextSize() + 'px' }

function setBorder(e) {
    drawing.setAttribute("stroke", getBorderColor());
    drawing.setAttribute("stroke-width", getBorderWidth());

}
function setFill(e) { drawing.setAttribute("fill", getFillColor()); }
function setText(e) {
    if (drawing.tagName === 'text') {
        drawing.innerHTML = getTextContent();
        drawing.setAttribute("font-size", getTextSizeString());
    }
}
window.addEventListener('resize', (e) => { bound = svg.getBoundingClientRect(); })
svg.addEventListener('mousedown', mouseDown);
svg.addEventListener('mousemove', mouseMove);
svg.addEventListener('mouseup', mouseUp);

document.querySelectorAll('#tool-select>a').forEach((element) => {
    element.addEventListener('click', (event) => {
        selected = element.id;
        document.querySelector('.selected').classList.remove('selected');
        element.classList.add('selected');
    })
});
document.getElementById('border-picker').addEventListener('change', (e) => {
    document.getElementById('border-hex').innerText = e.originalTarget.value.toUpperCase();
});
document.getElementById('fill-picker').addEventListener('change', (e) => {
    document.getElementById('fill-hex').innerText = e.originalTarget.value.toUpperCase();
});

document.getElementById('layer-up').addEventListener('click', (e) => {
    let layer_selected = Number(layer.value);
    if (layer_selected < layer.children.length - 1) {
        svg.children[layer_selected].before(svg.children[layer_selected + 1])
        refreshLayerList()
        layer.value = layer_selected + 1
    }
})
document.getElementById('layer-down').addEventListener('click', (e) => {
    let layer_selected = Number(layer.value);
    if (layer_selected > 0) {
        svg.children[layer_selected].after(svg.children[layer_selected - 1])
        refreshLayerList()
        layer.value = layer_selected - 1
    }
})
document.getElementById('layer-del').addEventListener('click', (e) => {
    let layer_selected = Number(layer.value);
    svg.children[layer_selected].remove();
    refreshLayerList()
});
document.getElementById('layer-clear').addEventListener('click', (e) => {
    svg.clearChildren()
    layer.value = svg.children.length
    refreshLayerList()
});
layer.addEventListener('change', (e) => {
    let text_content_div = document.getElementById('text-content');
    let text_size_div = document.getElementById('text-size');
    let no_border_sel = document.getElementById('no-border');
    let color_border_sel = document.getElementById('color-border');
    let border_hex_text = document.getElementById('border-hex');
    let border_picker_button = document.getElementById('border-picker')
    let border_width_input = document.getElementById('border-width');
    let no_fill_sel = document.getElementById('no-fill');
    let color_fill_sel = document.getElementById('color-fill');
    let fill_hex_text = document.getElementById('fill-hex');
    let fill_picker_button = document.getElementById('fill-picker');
    dwaring = svg.children[Number(layer.value)];

    if (dwaring.tagName === 'text') {
        text_content_div.value = dwaring.innerHTML;
        text_size_div.value = dwaring.getAttribute('font-size').replace('px', '');
    } else {
        text_content_div.value = '';
        text_size_div.value = '16';
    }
    let stroke = dwaring.getAttribute('stroke')
    if (stroke === 'transparent') { no_border_sel.click(); }
    else {
        color_border_sel.click();
        border_hex_text.innerText = stroke;
        border_picker_button.value = stroke;
        border_width_input.value = dwaring.getAttribute('stroke-width')
    }
    if (drawing.tagName !== 'line') {
        let fill = dwaring.getAttribute('fill')
        if (fill === 'transparent') { no_fill_sel.click(); }
        else {
            color_fill_sel.click();
            fill_hex_text.innerText = fill;
            fill_picker_button.value = fill;
        }
    }

})

document.querySelector('#text-content').addEventListener('change', setText)
document.querySelector('#text-size').addEventListener('change', setText)
document.querySelector('#no-border').addEventListener('click', setBorder);
document.querySelector('#color-border').addEventListener('click', setBorder);
document.querySelector('#border-picker').addEventListener('change', setBorder);
document.querySelector('#border-width').addEventListener('change', setBorder);
document.querySelector('#no-fill').addEventListener('click', setFill);
document.querySelector('#color-fill').addEventListener('click', setFill);
document.querySelector('#fill-picker').addEventListener('change', setFill);