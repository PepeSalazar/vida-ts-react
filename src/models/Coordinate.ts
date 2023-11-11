export class Coordinate {
  constructor(public x : number = 1, public y : number = -1){
    this.x = x;
    this.y = y;
  }

  isEqual(other : Coordinate) : boolean{
    if(!other){ return false; }
    if(other.x !== this.x){ return false; }
    return other.y === this.y;
  }
}