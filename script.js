
const brushes = document.getElementById('brushes');
const canvasContainer = document.getElementById('canvas-container');
const castomFilter = document.getElementById('castomFilter');
const dawnloadCanvas = document.getElementById('dawnloadCanvas');
const fotoFilterTools = document.getElementById('fotoFilterTools')
const pencilOnOf = document.getElementById('pencilOnOf');
const colorFill = document.getElementById('colorFill');
const sidebar = document.getElementById('sidebar');
const action = document.getElementById('action');
const drawChanger = document.getElementById('drawChanger');
const lineWidth = document.getElementById('lineWidth');
const brushColor = document.getElementById('brushColor');
const upload = document.getElementById('input');
const canvas = document.getElementById('canvas');
const lineRound = document.getElementById('lineRound');
const ctx = canvas.getContext('2d',{ willReadFrequently: true });

let fill = false;
let draw = false;
let drawing = true;
let lineCap = 'butt';
let isElusion = false;
let cordX = null;
let cordY = null;
let isLineStraight = false;
let isEraser = 'source-over';
let cursorColor = 'red';
let undueCanvas = [];

let imgStartPointWidth;
let imgStartPointHeight;
let imageWidth;
let imageHeight;
let imgSrc;
let cutOffCanvas;
let alpha = 1;

let rainbow = false;
let color = Math.floor(Math.random()*360);

fotoFilterTools.addEventListener('click',(e) => {
    e.preventDefault()
})
action.addEventListener('click',(e) => {
    e.preventDefault()
})


//Save data of canvas
setInterval(() => {
    const data = canvas.toDataURL();
    localStorage.setItem('canvasCtx',data);
},6000)

//load data in canvas
window.addEventListener('load',() => {
    const img = new Image();
    img.src = localStorage.getItem('canvasCtx');

    img.onload = () => {
        ctx.drawImage(img,0,0,canvas.width,canvas.height)
    }
})

window.addEventListener('load',() => {
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
})

window.addEventListener('resize',() => {
    const img = new Image();
    img.src = canvas.toDataURL();

    img.onload = () => {
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
})

document.getElementById('clearCanvas').addEventListener('click',() => {
    drawing = true;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    cutOffCanvas = undefined;
    localStorage.setItem('currentImg','')
    canvasContainer.width = window.innerWidth;
    canvasContainer.height = window.innerHeight *0.8;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
})

//TOOLS
function tools(){
    return{
        straightLine: (e)=> {
            isLineStraight = !isLineStraight;
            tools().unpen(e);
        },
        isDrawing: (e) => {
            drawing = !drawing ;
            if (drawing === false) {
                pencilOnOf.src = './Images/pencil-off.png';
                
            } else {
                pencilOnOf.src = './Images/pencil.png';
            }
        },
        lineCapRound: (e) => {
            if (lineCap === 'round') {
                lineCap = 'butt';
                lineRound.innerText = '⚪';
            }else{
                lineCap = 'round';
                lineRound.innerText = '⬜';
            }
        },
        elusion: (e) => {
            isElusion = !isElusion;
            tools().unpen(e);
        },
        myPen: (e) => {
            fill = !fill;
            tools().unpen(e);
            colorFill.click();
        },
        eraser: (e) =>{
            if (isEraser === 'destination-out') {
                isEraser = 'source-over';
            }else{
                isEraser = 'destination-out';
            }
            e.target.style.background = e.target.style.background === 'green'? 'transparent':'green';
        },
        pen: () => {
            sidebar.style.display = 'none';
            action.style.display = 'flex';
        },
        unpen: (e) => {
            e.target.style.background = e.target.style.background === 'green'? 'transparent':'green';
        },
        brushes: () => {
            action.style.display = 'none';
            brushes.style.display = 'flex';
        },
        exit: () => {
            action.style.display = 'none';
            sidebar.style.display = 'flex';
            fotoFilterTools.style.display = 'none';
            brushes.style.display = 'none';
        },
        download: function(format){
                const imageURL = canvas.toDataURL(`image/${format}`);
                const link = document.createElement('a');
                link.href = imageURL;
                link.download = `my-drawing.${format}`
                link.click();
        },
        openDownload: () => {
            if (dawnloadCanvas.style.display === 'none') {
                dawnloadCanvas.style.display = 'flex';
            }else{
                dawnloadCanvas.style.display = 'none';
            }
        },
        back: () => {
            const img = new Image();
            img.src = undueCanvas[undueCanvas.length -2];
            if (undueCanvas.length > 1) undueCanvas.pop();
            img.onload = () => {
                ctx.clearRect(0,0,canvas.width,canvas.height)
                ctx.drawImage(img,0,0,canvas.width,canvas.height);
            }
            
        },
        filterBar: () => {
            action.style.display = 'none';
            fotoFilterTools.style.display = 'flex';
        },
        filters: () =>{
            return {
                sepia: ()=>{
                    ctx.filter = 'sepia(100%)';
                    ctx.drawImage(canvas,0,0)
                    ctx.filter = 'none';
                    undueCanvas.push(canvas.toDataURL());
                    if(undueCanvas.length > 15) {
                        undueCanvas.splice(0,1);
                    }
                },
                blur: ()=>{
                    ctx.filter = 'blur(300px)';
                    ctx.drawImage(canvas,0,0)
                    ctx.filter = 'none';
                    undueCanvas.push(canvas.toDataURL());
                    if(undueCanvas.length > 15) {
                        undueCanvas.splice(0,1);
                    }
                },
                hueRotate:()=>{
                    ctx.filter = 'hue-rotate(10deg)';
                    ctx.drawImage(canvas,0,0);
                    ctx.filter = 'none'
                    undueCanvas.push(canvas.toDataURL());
                    if(undueCanvas.length > 15) {
                        undueCanvas.splice(0,1);
                    }
                },
                gray: ()=>{
                    ctx.filter = 'grayscale(100%)';
                    ctx.drawImage(canvas,0,0);
                    ctx.filter = 'none';
                    undueCanvas.push(canvas.toDataURL());
                    if(undueCanvas.length > 15) {
                        undueCanvas.splice(0,1);
                    }
                },
                saturate: ()=>{
                    ctx.filter = 'saturate(200%)';
                    ctx.drawImage(canvas,0,0);
                    ctx.filter = 'none'
                    undueCanvas.push(canvas.toDataURL());
                    if(undueCanvas.length > 15) {
                        undueCanvas.splice(0,1);
                    }
                },
                contrast:()=>{
                    ctx.filter = 'contrast(110%)';
                    ctx.drawImage(canvas,0,0);
                    ctx.filter = 'none'
                    undueCanvas.push(canvas.toDataURL());
                    if(undueCanvas.length > 15) {
                        undueCanvas.splice(0,1);
                    }
                },
            }
        },
    brushesTools: () => {
        return{
            marker:(e) => {
                if (alpha === 0.1) {
                    alpha = 1;
                    e.target.style.background = 'transparent'
                }else{
                    alpha = 0.1;
                    e.target.style.background = 'green'
                }
            },
            rainbow: (e) => {
                if (!rainbow) {
                    rainbow = true;
                    e.target.style.background = 'green'
                }else{
                    rainbow = false;
                    e.target.style.background = 'transparent'
                }
            },
            lighter: (e) => {
                if (isEraser === 'lighter') {
                    isEraser = 'source-over'
                    e.target.style.background = 'transparent'
                }else{
                    isEraser = 'lighter';
                    e.target.style.background = 'green'
                }
            },
            darken: (e) => {
                if (isEraser === 'darken') {
                    isEraser = 'source-over'
                    tools().unpen(e);
                }else{
                    isEraser = 'darken'
                    tools().unpen(e);
                }
            },
            difference: (e) => {
                if (isEraser === 'difference') {
                    isEraser = 'source-over'
                    tools().unpen(e);
                }else{
                    isEraser = 'difference';
                    tools().unpen(e);
                }
            },
            exclusion: (e) => {
                if (isEraser === 'exclusion') {
                    isEraser = 'source-over'
                    tools().unpen(e);
                }else{
                    isEraser = 'exclusion'
                    tools().unpen(e);
                }
            },
            hardLight: (e) => {
                if (isEraser === 'hard-light') {
                    isEraser = 'source-over';
                    tools().unpen(e);
                }else{
                    isEraser = 'hard-light'
                    tools().unpen(e);
                }
            },
            softLight: (e) => {
                if (isEraser === 'soft-light') {
                    isEraser = 'source-over';
                    tools().unpen(e);
                }else{
                    isEraser = 'soft-light'
                    tools().unpen(e);
                }
            },
            multiply: (e) => {
                if (isEraser === 'multiply') {
                    isEraser = 'source-over';
                    tools().unpen(e);
                }else{
                    isEraser = 'multiply'
                    tools().unpen(e);
                }
            },
            screen: (e) => {
                if (isEraser === 'screen') {
                    isEraser = 'source-over';
                    tools().unpen(e);
                }else{
                    isEraser = 'screen'
                    tools().unpen(e);
                }
            },
            overlay: (e) => {
                if (isEraser === 'overlay') {
                    isEraser = 'source-over';
                    tools().unpen(e);
                }else{
                    isEraser = 'overlay'
                    tools().unpen(e);
                }
            }, 

        }
    },
    
}
}


//Main draw func
canvas.addEventListener('mousedown',(e) => {
    if (drawing === false) return;
    const rect = canvas.getBoundingClientRect();

    cordX = e.offsetX;
    cordY = e.offsetY;

        ctx.beginPath()
        ctx.moveTo(cordX,cordY);
        ctx.lineCap = lineCap;
        draw = true;
})
canvas.addEventListener('mouseout',() => {
    draw = false;
})
canvas.addEventListener('mousemove',(e) => {
    if (draw) {
        if (rainbow) {
            color += 30;
            ctx.globalAlpha = alpha;
            isElusion && ctx.moveTo(cordX,cordY);
            ctx.lineWidth = lineWidth.value;
            ctx.strokeStyle = `hsl(${color},100%,50%)`;
            ctx.beginPath();
            ctx.moveTo(cordX,cordY);
            ctx.lineTo(e.offsetX,e.offsetY);
            ctx.stroke();
            if (color === 360) color = 0;

            cordX = e.offsetX;
            cordY = e.offsetY;
        }else{
            ctx.globalAlpha = alpha;
            const rect = canvas.getBoundingClientRect();
            ctx.globalCompositeOperation = isEraser;
            isElusion && ctx.moveTo(cordX,cordY);
            ctx.strokeStyle = brushColor.value;
            ctx.lineWidth = lineWidth.value;
            if (!isLineStraight) {
                ctx.lineTo(e.offsetX - rect.left,e.offsetY - rect.top);
                ctx.stroke();
            }
            if (fill) {
                ctx.fillStyle = colorFill.value;
                ctx.fill();
            }
        }
    }
})
canvas.addEventListener('mouseup',(e) => {
    if (drawing) {
    if (isLineStraight && !fill) {
        ctx.lineTo(e.offsetX-canvas.getBoundingClientRect().left,e.offsetY-canvas.getBoundingClientRect().top);
        ctx.stroke();
    }if (lineCap === 'round' && !fill) {
            ctx.beginPath();
            ctx.arc(e.offsetX,e.offsetY,lineWidth.value /2,0,Math.PI*2);
            ctx.fillStyle = brushColor.value;
            ctx.fill();
            ctx.closePath();
        }

    cordX = null;
    cordY = null;
    draw = false;
    ctx.closePath()

    if (undueCanvas.length > 10) {
        undueCanvas.splice(0,1);
    }
    undueCanvas.push(canvas.toDataURL())

    
    if(fill){
        ctx.strokeWidth
        ctx.closePath()
        ctx.stroke()
    }
}
})

//FOR TOUCH
canvas.addEventListener('touchstart',(e) => {
      if(!drawing)return;
      e.preventDefault();
      const touch = e.touches[0];

      cordX = touch.clientX;
      cordY = touch.clientY;
      
      ctx.beginPath();
      ctx.moveTo(cordX,cordY);
      ctx.lineCap = lineCap;
      draw = true;
      
    })

    canvas.addEventListener('touchmove',(e) => {
        
      if ( e.touches.length === 1 && draw) {
        const touch = e.touches[0];
        if (rainbow) {
            color += 30;
            ctx.globalAlpha = alpha;
            isElusion && ctx.moveTo(cordX,cordY);
            ctx.lineWidth = lineWidth.value;
            ctx.strokeStyle = `hsl(${color},100%,50%)`;
            ctx.beginPath();
            ctx.moveTo(cordX,cordY);
            ctx.lineTo(touch.clientX,touch.clientY);
            ctx.stroke();
            if (color === 360) color = 0;

            cordX = touch.clientX;
            cordY = touch.clientY;
        }else{
            e.preventDefault();
            
            ctx.globalAlpha = alpha;
            ctx.globalCompositeOperation = isEraser;
            isElusion && ctx.moveTo(cordX,cordY);
            ctx.strokeStyle = brushColor.value;
            ctx.lineWidth = lineWidth.value;
            if (!isLineStraight) {
                ctx.lineTo(touch.clientX,touch.clientY);
                ctx.stroke();
            }
            if (fill) {
                ctx.fillStyle = colorFill.value;
                ctx.fill();
            }
        }
    }
})

    canvas.addEventListener('touchend',(e) => {
        if (isLineStraight) {
            ctx.lineTo(e.changedTouches[0].clientX,e.changedTouches[0].clientY);
            ctx.stroke();
        }else if (lineCap === 'round' && !fill) {
            ctx.beginPath();
            ctx.arc(e.changedTouches[0].clientX,e.changedTouches[0].clientY,lineWidth.value /2,0,Math.PI*2);
            ctx.fillStyle = brushColor.value;
            ctx.fill();
            ctx.closePath();
        }if(fill){
            ctx.strokeWidth
            ctx.closePath()
            ctx.stroke()
        }
        
        cordX = null;
        cordY = null;
        draw = false;
        ctx.closePath()

        if (undueCanvas.length > 10) {
            undueCanvas.splice(0,1);
        }
        undueCanvas.push(canvas.toDataURL())
    })

//Load file
upload.addEventListener('input',function(){
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e){
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = () => {
            if (img.width > 3000 || img.height > 3000) {
                canvas.width = img.width/2;
                canvas.height = img.height/2;
                canvasContainer.style.width = img.width/2;
                canvasContainer.style.height = img.height/2;
            }else{
                canvas.width = img.width;
                canvas.height = img.height;
                canvasContainer.width = img.width;
                canvasContainer.height = img.height;
            }
            ctx.clearRect(0,0,canvas.width,canvas.height)
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            drawing = false;
            undueCanvas.push(canvas.toDataURL());
    };
    }

    
    reader.readAsDataURL(file)
})

//new 


let startX, startY, scrollLeft, scrollTop;

canvasContainer.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  scrollLeft = canvasContainer.scrollLeft;
  scrollTop = canvasContainer.scrollTop;
  e.preventDefault()
  
});

canvasContainer.addEventListener("touchmove", (e) => {
  if (drawing) return;
  if (!drawing) {
    const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  
  const walkX = startX - x;
  const walkY = startY - y; 
  
  canvasContainer.scrollLeft = scrollLeft + walkX;
  canvasContainer.scrollTop = scrollTop + walkY;
  }
  
});

canvasContainer.addEventListener("touchend", () => {
  isDragging = false;
});
