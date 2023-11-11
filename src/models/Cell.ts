import {Coordinate} from "./Coordinate";
import {CELL_STATUS} from "@/enums/CellStatus";
import Utils from "@/utils/utils";

export class Cell {
    private ghost: CELL_STATUS = CELL_STATUS.DEAD;

    constructor(private id: number = -1,
                private coordinate: Coordinate = new Coordinate(),
                private cellStatus: CELL_STATUS = CELL_STATUS.DEAD,
                private colony: number = -1,
                private cellSize: number = 4,
                private intracellularSpace: number = 0) {
        this.id = id;
        this.coordinate = coordinate;
        this.cellStatus = cellStatus;
        this.colony = colony;
        this.cellSize = cellSize;
        this.intracellularSpace = intracellularSpace;
    }

    public setEstado(estado: CELL_STATUS): void {
        this.cellStatus = estado;
    }

    public getEstado(): CELL_STATUS {
        return this.cellStatus;
    }

    public setColony(colonyId: number): void {
        this.colony = colonyId;
    }

    public getColony(): number {
        return this.colony;
    }

    public getId(): number {
        return this.id;
    }

    public getCoordinates(): Coordinate {
        return this.coordinate;
    }

    public setCoordinate(value: Coordinate) {
        this.coordinate = value;
    }

    public isEqual(other: Cell): boolean {
        if (!other) {
            return false;
        }
        return other.getCoordinates().isEqual(this.getCoordinates());
    }

    public setGhost(ghost: CELL_STATUS) {
        this.ghost = ghost;
    }

    public move(): void {
        this.cellStatus = this.ghost;
    }

    public calculateStatus(aliveNeighbors: number): CELL_STATUS {
        let newStatus = CELL_STATUS.DEAD;
        let b = 3;//3
        let s = [2, 3];//2,3

        if (aliveNeighbors < s[0] && this.cellStatus === CELL_STATUS.ALIVE) {
            newStatus = CELL_STATUS.DEAD; // Muere de soledad
        }
        if ((aliveNeighbors === s[0] || aliveNeighbors === s[1]) && this.cellStatus === CELL_STATUS.ALIVE) {
            newStatus = CELL_STATUS.ALIVE; // Se queda viva
        }
        if (aliveNeighbors > s[1] && this.cellStatus === CELL_STATUS.ALIVE) {
            newStatus = CELL_STATUS.DEAD; // Se muere por sobrepoblación
        }
        if (aliveNeighbors === b && this.cellStatus === CELL_STATUS.DEAD) {
            newStatus = CELL_STATUS.ALIVE; //Revive por reproducción
        }

        return newStatus;
    }

    public render(context: any): void {
        let x: number = this.getCoordinates().x * this.cellSize;//Calcula la posición de la célula en el canvas.
        let y: number = this.getCoordinates().y * this.cellSize;
        let cellWidth: number = this.cellSize - this.intracellularSpace;
        let cellHeight: number = this.cellSize - this.intracellularSpace;

        context.fillStyle = Utils.selectColor(this);
        context.fillRect(x, y, cellWidth, cellHeight);

        // context.fillStyle = "#000";
        // context.font      = "10px Arial";
        // context.fillText(this.getId().toString(), (x + this.cellSize / 2), (y + this.cellSize / 2));
    }

}