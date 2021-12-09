class Point {
    constructor(x, y) { this.update(x, y) }
    update(x, y) {
        this.x = x - canvas.offsetLeft;
        this.y = y - canvas.offsetTop;
    }
    toString() { return this.x + ' , ' + this.y }
}

class Shape {
    constructor(x, y) {
        this.start=new Point(x,y);
    }
}
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let show = document.getElementById('pos');
let currentCursorPosition = new Point(0, 0);
let selected = 'pointer';


canvas.addEventListener('click', (event) => {
        console.log(event.region)
})
canvas.addEventListener('mousemove', (event) => {
    currentCursorPosition.update(event.clientX, event.clientY);
    show.innerHTML = currentCursorPosition.toString();
})

document.querySelectorAll('.toolbar>a').forEach((element) => {
    if (element.id === 'image') {
        // TODO
        // open image
    }
    else if (element.id === 'download') {
        // TODO
        // download
    }
    else {
        element.addEventListener('click', (event) => {
            selected = element.id;
            document.querySelector('.selected').classList.remove('selected');
            element.classList.add('selected');
        })

    }
});

ctx.strokeStyle = 'red';
ctx.lineWidth = 52;

// draw a red line
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 100);
ctx.stroke();
ctx.fillRect(100, 100, 100, 200)