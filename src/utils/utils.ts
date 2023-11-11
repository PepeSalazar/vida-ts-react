import {Cell} from "@/models/Cell";
import {ESTADO_CELULA} from "@/enums/EstadoCelula";
export default class Utils {

  constructor(){
  }

  /**
   * Genera número random entre 1 y 0. Aproximádamente 50% de chance de cada valor.
   * @param min
   * @param max
   * @return {number}
   */
  static generarNumeroRandom(min : number, max : number) : number{
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Selecciona el color de las celulas para mostrar.
   * @param celula
   * @return {string}
   */
  static seleccionarColor(celula : Cell) : string{
    let estado = celula.getEstado();

    if(estado === ESTADO_CELULA.MUERTA){ return "#09C"; }
    if(estado === ESTADO_CELULA.SELECCIONADA){ return "#FF0"; }

    let cadena : string = Math.floor(celula.getColonia()).toString(16);
    cadena              = Utils.formatearCadena(cadena);
    if(cadena !== "00"){
      cadena = "#00CC" + cadena;
    } else {
      cadena = "#00CCFF";
    }
    return cadena;
  }

  /**
   * Verifica que la cadena tenga al menos dos caracteres.
   * @param cadena
   * @returns {string}
   */
  static formatearCadena(cadena : string) : string{
    let cadenaFormateada = cadena;
    if(cadena.length < 2){
      cadenaFormateada = "0" + cadena;
    }
    return cadenaFormateada;
  }
}