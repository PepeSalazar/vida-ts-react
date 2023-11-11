import {Coordenada} from "./Coordenada";
import {ESTADO_CELULA} from "../enums/EstadoCelula";
import Utils from "@/utils/utils";

export class Cell {
    private fantasma: ESTADO_CELULA = ESTADO_CELULA.MUERTA;

    constructor(private id: number = -1,
                private coordenada: Coordenada = new Coordenada(),
                private estado: ESTADO_CELULA = ESTADO_CELULA.MUERTA,
                private colonia: number = -1,
                private tamanoCelula: number = 4,
                private espacioCelular: number = 0) {
        this.id = id;
        this.coordenada = coordenada;
        this.estado = estado;
        this.colonia = colonia;
        this.tamanoCelula = tamanoCelula;
        this.espacioCelular = espacioCelular;
    }

    public setEstado(estado: ESTADO_CELULA): void {
        this.estado = estado;
    }

    public getEstado(): ESTADO_CELULA {
        return this.estado;
    }

    public setColonia(idColonia: number): void {
        this.colonia = idColonia;
    }

    public getColonia(): number {
        return this.colonia;
    }

    public getId(): number {
        return this.id;
    }

    public getCoordenada(): Coordenada {
        return this.coordenada;
    }

    public setCoordenada(value: Coordenada) {
        this.coordenada = value;
    }

    public esIgual(otra: Cell): boolean {
        if (!otra) {
            return false;
        }
        return otra.getCoordenada().esIgual(this.getCoordenada());
    }

    public setFantasma(fantasma: ESTADO_CELULA) {
        this.fantasma = fantasma;
    }

    public desfasar(): void {
        this.estado = this.fantasma;
    }

    public calcularEstado(vecinosVivos: number): ESTADO_CELULA {
        let nuevoEstado = ESTADO_CELULA.MUERTA;
        let b = 3;//3
        let s = [2, 3];//2,3

        if (vecinosVivos < s[0] && this.estado === ESTADO_CELULA.VIVA) {
            nuevoEstado = ESTADO_CELULA.MUERTA; // Muere de soledad
        }
        if ((vecinosVivos === s[0] || vecinosVivos === s[1]) && this.estado === ESTADO_CELULA.VIVA) {
            nuevoEstado = ESTADO_CELULA.VIVA; // Se queda viva
        }
        if (vecinosVivos > s[1] && this.estado === ESTADO_CELULA.VIVA) {
            nuevoEstado = ESTADO_CELULA.MUERTA; // Se muere por sobrepoblación
        }
        if (vecinosVivos === b && this.estado === ESTADO_CELULA.MUERTA) {
            nuevoEstado = ESTADO_CELULA.VIVA; //Revive por reproducción
        }

        return nuevoEstado;
    }

    public pintar(contexto: any): void {
        let x: number = this.getCoordenada().x * this.tamanoCelula;//Calcula la posición de la célula en el canvas.
        let y: number = this.getCoordenada().y * this.tamanoCelula;
        let celulaWidth: number = this.tamanoCelula - this.espacioCelular;
        let celulaHeight: number = this.tamanoCelula - this.espacioCelular;

        contexto.fillStyle = Utils.seleccionarColor(this);
        contexto.fillRect(x, y, celulaWidth, celulaHeight);

        // contexto.fillStyle = "#000";
        // contexto.font      = "10px Arial";
        // contexto.fillText(this.getId().toString(), (x + this.tamanoCelula / 2), (y + this.tamanoCelula / 2));
    }

}