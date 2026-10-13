import {SIZE,createGame,turn,tick} from './engine.js';
const $=id=>document.getElementById(id);
const canvas=$('board'),ctx=canvas.getContext('2d'),cell=canvas.width/SIZE;
let game=createGame(),timer=null,best=0;
try{best=Number(localStorage.getItem('snake-best'))||0;}catch{}
$('best').textContent=best;
game.state='idle';
function draw(){
  ctx.fillStyle='#172315';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#253321';ctx.lineWidth=1;
  for(let i=1;i<SIZE;i++){ctx.beginPath();ctx.moveTo(i*cell,0);ctx.lineTo(i*cell,600);ctx.moveTo(0,i*cell);ctx.lineTo(600,i*cell);ctx.stroke();}
  game.snake.forEach((p,i)=>{ctx.fillStyle=i===0?'#d4f99c':'#a8d66e';ctx.beginPath();ctx.roundRect(p.x*cell+2,p.y*cell+2,cell-4,cell-4,7);ctx.fill();});
  const h=game.snake[0],vertical=['up','down'].includes(game.direction);
  ctx.fillStyle='#25391c';
  for(const s of [-1,1]){let x=h.x*cell+cell/2,y=h.y*cell+cell/2;if(vertical){x+=s*6;y+=game.direction==='up'?-5:5;}else{y+=s*6;x+=game.direction==='left'?-5:5;}ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();}
  if(game.food){const x=(game.food.x+.5)*cell,y=(game.food.y+.5)*cell;ctx.shadowColor='#f28b70';ctx.shadowBlur=14;ctx.fillStyle='#f28b70';ctx.beginPath();ctx.arc(x,y+1,9,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#b8ec78';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y-8);ctx.lineTo(x+4,y-13);ctx.stroke();}
}
function overlay(title,hint,label,symbol){$('message').textContent=title;$('hint').textContent=hint;$('play').textContent=label;$('symbol').textContent=symbol;$('overlay').hidden=false;}
function schedule(){clearTimeout(timer);if(game.state==='playing')timer=setTimeout(step,Math.max(75,160-game.score*4));}
function step(){tick(game);$('score').textContent=game.score;if(game.score>best){best=game.score;$('best').textContent=best;try{localStorage.setItem('snake-best',String(best));}catch{}}
  draw();if(game.state==='over'||game.state==='won'){$('pause').disabled=true;$('status').textContent=game.state==='won'?'Всё поле твоё!':'Попробуем ещё раз?';overlay(game.state==='won'?'Победа!':'Вот и укус.',`Твой счёт: ${game.score}. Рекорд: ${best}.`,'Ещё раз →',game.state==='won'?'★':'↺');}else schedule();
}
function start(){clearTimeout(timer);game=createGame();$('score').textContent=0;$('overlay').hidden=true;$('pause').disabled=false;$('pause').textContent='Пауза Ⅱ';$('status').textContent='Собирай яблоки. Береги хвост.';draw();schedule();}
function pause(){if(game.state==='playing'){game.state='paused';clearTimeout(timer);$('pause').textContent='Продолжить ▷';$('status').textContent='Можно выдохнуть';overlay('Пауза','Змейка подождёт.','Продолжить →','Ⅱ');}else if(game.state==='paused'){game.state='playing';$('overlay').hidden=true;$('pause').textContent='Пауза Ⅱ';$('status').textContent='Собирай яблоки. Береги хвост.';schedule();}}
$('play').addEventListener('click',()=>game.state==='paused'?pause():start());$('pause').addEventListener('click',pause);
const keys={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',ц:'up',ы:'down',ф:'left',в:'right'};
document.addEventListener('keydown',e=>{const direction=keys[e.key]||keys[e.key.toLowerCase()];if(direction){e.preventDefault();turn(game,direction);}else if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();if(!e.repeat)pause();}});
document.querySelectorAll('[data-direction]').forEach(b=>b.addEventListener('click',()=>turn(game,b.dataset.direction)));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='playing')pause();});
let touch=null;canvas.addEventListener('touchstart',e=>{touch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});canvas.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.max(Math.abs(dx),Math.abs(dy))>12)turn(game,Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));touch=null;},{passive:true});
draw();
