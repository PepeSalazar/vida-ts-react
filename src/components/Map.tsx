import * as React from 'react';
import {useEffect, useState} from "react";
import {Cell} from "@/models/Cell";
import {Coordinate} from "@/models/Coordinate";
import {CELL_STATUS} from "@/enums/CellStatus";
import {Canvas} from "@/components/Canvas";
import {CellConfig, MapConfig} from "@/types/MapConfig";
import Utils from "@/utils/utils";

type Props = {
    mapConfig: MapConfig
    cellConfig: CellConfig
};

export const Map = (props: Props) => {
    const {mapConfig, cellConfig} = props
    const {rows, columns} = mapConfig
    const [generations, setGenerations] = useState(0)
    const [cells, setCells] = useState<Cell[][]>([])
    const [autoplay, setAutoplay] = useState(false)

    useEffect(() => {
        const cells = initializeCells()
        setCells(cells)
    }, [])

    useEffect(() => {
        if (!autoplay) return

        tick()
    }, [cells]);

    const initializeCells = (): Cell[][] => {
        const {cellSize, intracellularSpace} = cellConfig

        let cells = new Array(rows);

        for (let x: number = 0; x < rows; x++) {
            cells[x] = new Array(columns);

            for (let y: number = 0; y < columns; y++) {
                let id = ((x * columns) + y);
                cells[x][y] = new Cell(id, new Coordinate(x, y), CELL_STATUS.DEAD, -1, cellSize, intracellularSpace);
            }
        }

        return cells
    }

    const isInTheMap = (x: number, y: number): boolean => {
        return (x >= 0 && y >= 0 && x < rows && y < columns);
    }

    const getCell = (x: number, y: number): Cell => {
        let cell: Cell;
        let exists = isInTheMap(x, y);
        if (exists) {
            cell = cells[x][y];
        } else {
            cell = new Cell();
        }
        return cell;
    }

    const iterateCells = (cells: Cell[][], func: (cell: Cell) => Cell) => {
        return cells.map((row) => {
            return row.map(func)
        })
    }

    //Si es célula vecina válida y viva, y no su padre.
    const isValidNeighborCell = (cell: Cell, parent?: Cell) => {
        if (!parent) return true
        return (cell.getId() !== -1 && cell.getEstado() === CELL_STATUS.ALIVE && !cell.isEqual(parent));
    }

    const getNeighborCells = (cell: Cell) => {
        let neighbors: Cell [] = [];
        let coordinate: Coordinate = cell.getCoordinates();
        neighbors.push(getCell(coordinate.x - 1, coordinate.y - 1));
        neighbors.push(getCell(coordinate.x - 1, coordinate.y));
        neighbors.push(getCell(coordinate.x - 1, coordinate.y + 1));
        neighbors.push(getCell(coordinate.x, coordinate.y - 1));
        neighbors.push(getCell(coordinate.x, coordinate.y + 1));
        neighbors.push(getCell(coordinate.x + 1, coordinate.y - 1));
        neighbors.push(getCell(coordinate.x + 1, coordinate.y));
        neighbors.push(getCell(coordinate.x + 1, coordinate.y + 1));
        return neighbors;
    }

    const countAliveNeighbors = (cell: Cell): number => {
        let neighborCounter: number = 0;
        let neighbors: Cell[] = getNeighborCells(cell);
        neighbors.forEach((neighbor) => {
            if (neighbor.getId() !== -1 && neighbor.getEstado() === CELL_STATUS.ALIVE) {
                neighborCounter++;
            }
        });
        return neighborCounter;
    }

    const assignColony = (cell: Cell, parent?: Cell): void => {
        if (parent) {
            cell.setColony(parent.getColony());
            return;
        }
        let colony = Math.floor(Math.random() * (255));
        cell.setColony(colony);
    }

    const detectColonies = (cells: Cell[][]) => {
        return iterateCells(cells, (cell) => {
            detectColony(cell)
            return cell
        })
    }

    const detectColony = (cell: Cell, parent?: Cell): void => {
        let neighbors: Cell[];
        if (cell.getColony() !== -1) {
            return;
        }
        if (cell.getEstado() === CELL_STATUS.DEAD) {
            return;
        }

        const isCell = parent instanceof Cell
        const newParent = isCell ? parent : undefined
        assignColony(cell, newParent);
        neighbors = getNeighborCells(cell);

        neighbors.forEach(function (vecina) {
            let isValid = isValidNeighborCell(vecina, newParent);

            if (isValid) {
                detectColony(vecina, cell);
            }
        });
    }

    const exterminateLife = (): void => {
        const newCells = iterateCells(cells, (cell: Cell) => {
            cell.setEstado(CELL_STATUS.DEAD);
            return cell
        });

        setCells(newCells)
        setGenerations(0)
    }

    const generateLife = (): void => {
        iterateCells(cells, (cell) => {
            let status = CELL_STATUS.ALIVE;
            if (Utils.generateRandomNumber(0, 1) === 0) {
                status = CELL_STATUS.DEAD;
            }
            cell.setEstado(status);

            return cell
        })

        tick()
    }

    const resetColony = (cells: Cell[][]) => {
        return iterateCells(cells, (cell: Cell) => {
            let neighbors = countAliveNeighbors(cell);
            cell.setGhost(cell.calculateStatus(neighbors));
            cell.setColony(-1); // Resets the colony
            return cell
        })
    }

    const moveColony = (cells: Cell[][]) => {
        return iterateCells(cells, (cell: Cell) => {
            cell.move();
            return cell
        })
    }
    const tick = (): void => {
        let newCells = resetColony(cells);
        newCells = moveColony(newCells);
        newCells = detectColonies(newCells);

        setGenerations((generation) => {
            return generation + 1
        });

        setCells(newCells)
    }

    const play = () => {
        setAutoplay(true)
        tick()
    }

    const stop = () => {
        setAutoplay(false)
    }


    return (
        <div>
            <div>
                <button onClick={generateLife}>Generate life</button>
            </div>

            <div>
                <button onClick={tick}>Tick</button>
            </div>

            <div>
                <button onClick={exterminateLife}>Exterminate</button>
            </div>

            <div>
                <button onClick={play}>Play</button>
            </div>

            <div>
                <button onClick={stop}>Stop</button>
            </div>

            <div>{generations}</div>
            <Canvas width={rows} height={columns} cells={cells}/>
        </div>
    );
};