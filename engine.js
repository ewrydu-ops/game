export const SIZE = 20;
const vectors = { up: {x:0,y:-1}, down: {x:0,y:1}, left: {x:-1,y:0}, right: {x:1,y:0} };
export function placeFood(snake, random = Math.random) {
  const empty = [];
  for (let y=0;y<SIZE;y++) for (let x=0;x<SIZE;x++) {
    if (!snake.some(p=>p.x===x&&p.y===y)) empty.push({x,y});
  }
  return empty.length ? empty[Math.floor(random()*empty.length)] : null;
}
export function createGame(random = Math.random) {
  const snake = [{x:8,y:10},{x:7,y:10},{x:6,y:10}];
  return {snake, direction:'right', pending:'right', food:placeFood(snake,random), score:0, state:'playing'};
}
export function turn(game, direction) {
  if (game.state!=='playing'||!vectors[direction]||game.pending!==game.direction) return;
  const a=vectors[game.direction], b=vectors[direction];
  if (a.x+b.x!==0||a.y+b.y!==0) game.pending=direction;
}
export function tick(game, random = Math.random) {
  if (game.state!=='playing') return;
  game.direction=game.pending;
  const v=vectors[game.direction], head={x:game.snake[0].x+v.x,y:game.snake[0].y+v.y};
  const eating=game.food&&head.x===game.food.x&&head.y===game.food.y;
  const body=eating?game.snake:game.snake.slice(0,-1);
  if(head.x<0||head.y<0||head.x>=SIZE||head.y>=SIZE||body.some(p=>p.x===head.x&&p.y===head.y)) {
    game.state='over';return;
  }
  game.snake.unshift(head);
  if(eating){game.score++;game.food=placeFood(game.snake,random);if(!game.food)game.state='won';}
  else game.snake.pop();
}
