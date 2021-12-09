class Point {
    constructor(x, y) { this.update(x, y) }
    update(x, y) {
        this.x = x - canvas.offsetLeft;
        this.y = y - canvas.offsetTop;
    }
    toString() { return this.x + ' , ' + this.y }
}

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let show = document.getElementById('pos');
let currentCursorPosition = new Point(0, 0);
let selected = 'pointer';


canvas.addEventListener('mousemove', (e) => {
    currentCursorPosition.update(e.clientX, e.clientY);
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