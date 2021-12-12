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
let selected = 'pointer';
let mouseIsDown = false;
let mouseDownX, mousedownY;
let drawing;
let layer = document.getElementById('layer');


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


window.addEventListener('resize', (e) => { bound = svg.getBoundingClientRect(); })
svg.addEventListener('mousedown', mouseDownHandler);
svg.addEventListener('mousemove', mouseMoveHandler);
svg.addEventListener('mouseup', mouseUpHandler);

document.querySelectorAll('#tool-select>a').forEach((element) => {
    element.addEventListener('click', (event) => {
        selected = element.id;
        document.querySelector('.selected').classList.remove('selected');
        element.classList.add('selected');
    })
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
    if (drawing.hasAttribute('fill')) {
        let fill = dwaring.getAttribute('fill')
        if (fill === 'transparent') { no_fill_sel.click(); }
        else {
            color_fill_sel.click();
            fill_hex_text.innerText = fill;
            fill_picker_button.value = fill;
        }
    }

})

document.getElementById('border-picker').addEventListener('change', (e) => {
    document.getElementById('border-hex').innerText = e.originalTarget.value.toUpperCase();
});
document.getElementById('fill-picker').addEventListener('change', (e) => {
    document.getElementById('fill-hex').innerText = e.originalTarget.value.toUpperCase();
});
