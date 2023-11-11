export class Coordenada {
  constructor(public x : number = 1, public y : number = -1){
    this.x = x;
    this.y = y;
  }

  esIgual(otra : Coordenada) : boolean{
    if(!otra){ return false; }
    if(otra.x !== this.x){ return false; }
    return otra.y === this.y;
  }
}