// Prikupi sve DOM elemente koji su potrebni

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker'); 
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
// optional load button (may not exist in this version of the UI)
const loadBtn = document.getElementById('loadBtn');
const eraserBtn = document.getElementById('eraserBtn');

//Postavi pocetne vrijednosti
let drawing = false;
let currentColor = colorPicker.value;
let isErasing = false;

//Funkcije crtanja
function startDrawing(e) {
    drawing = true;
    draw(e);
}   

function endDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;   

    const rect = canvas.getBoundingClientRect();

    //Prilagodite polozaj misa velicini ploce
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isErasing ? '#FFFFFF' : currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

//Mouse Events
canvas.addEventListener('mousedown', startDrawing); 
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);

//Touhch Events (mobile / tablets)
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', endDrawing);
canvas.addEventListener('touchmove', e => { draw(e); e.preventDefault();});

//Toolbar Logic
colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
    isErasing = false;
});

eraserBtn.addEventListener('click', () => {
    isErasing = !isErasing;
    eraserBtn.textContent = isErasing ? 'Piši' : 'Briši';
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener('click', () => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'moj_crtez.png';
    link.click();
});