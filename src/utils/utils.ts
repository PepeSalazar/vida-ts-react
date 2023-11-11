import {Cell} from "@/models/Cell";
import {CELL_STATUS} from "@/enums/CellStatus";
export default class Utils {

  constructor(){
  }

  /**
   * Genera número random entre 1 y 0. Aproximádamente 50% de chance de cada valor.
   * @param min
   * @param max
   * @return {number}
   */
  static generateRandomNumber(min : number, max : number) : number{
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Selecciona el color de las celulas para mostrar.
   * @param cell
   * @return {string}
   */
  static selectColor(cell : Cell) : string{
    let status = cell.getEstado();

    if(status === CELL_STATUS.DEAD){ return "#09C"; }
    if(status === CELL_STATUS.SELECTED){ return "#FF0"; }

    let hexString : string = Math.floor(cell.getColony()).toString(16);
    hexString              = Utils.formatString(hexString);
    if(hexString !== "00"){
      hexString = "#00CC" + hexString;
    } else {
      hexString = "#00CCFF";
    }
    return hexString;
  }

  /**
   * Verifica que la cadena tenga al menos dos caracteres.
   * @param hexString
   * @returns {string}
   */
  static formatString(hexString : string) : string{
    let formattedString = hexString;
    if(hexString.length < 2){
      formattedString = "0" + hexString;
    }
    return formattedString;
  }
}