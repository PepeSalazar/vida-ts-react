import * as React from 'react';
import {useEffect, useState} from "react";
import {Cell} from "@/models/Cell";
import {Coordenada} from "@/models/Coordenada";
import {ESTADO_CELULA} from "@/enums/EstadoCelula";
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
    const [interval, setInterval] = useState(0)

    useEffect(() => {
        const cells = initializeCells()
        setCells(cells)

        return () => {
            window.clearInterval(interval)
        }
    }, [])

    const initializeCells = (): Cell[][] => {
        const {tamanoCelula, espacioCelular} = cellConfig

        let cells = new Array(rows);

        for (let x: number = 0; x < rows; x++) {
            cells[x] = new Array(columns);

            for (let y: number = 0; y < columns; y++) {
                let id = ((x * columns) + y);
                cells[x][y] = new Cell(id, new Coordenada(x, y), ESTADO_CELULA.MUERTA, -1, tamanoCelula, espacioCelular);
            }
        }

        return cells
    }

    const enElMapa = (x: number, y: number): boolean => {
        return !!(x >= 0 && y >= 0 && x < rows && y < columns);
    }

    const getCelula = (x: number, y: number): Cell => {
        let celula: Cell;
        let existe = enElMapa(x, y);
        if (existe) {
            celula = cells[x][y];
        } else {
            celula = new Cell();
        }
        return celula;
    }

    const recorrer = (cells: Cell[][], funcion: (cell: Cell) => Cell) => {
        return cells.map((row) => {
            return row.map(funcion)
        })
    }

    //Si es célula vecina válida y viva, y no su padre.
    const esCelulaVecinaValida = (celula: Cell, padre?: Cell) => {
        if (!padre) return true
        return (celula.getId() !== -1 && celula.getEstado() === ESTADO_CELULA.VIVA && !celula.esIgual(padre));
    }

    const obtenerCelulasVecinas = (celula: Cell) => {
        let vecinos: Cell [] = [];
        let coordenada: Coordenada = celula.getCoordenada();
        vecinos.push(getCelula(coordenada.x - 1, coordenada.y - 1));
        vecinos.push(getCelula(coordenada.x - 1, coordenada.y));
        vecinos.push(getCelula(coordenada.x - 1, coordenada.y + 1));
        vecinos.push(getCelula(coordenada.x, coordenada.y - 1));
        vecinos.push(getCelula(coordenada.x, coordenada.y + 1));
        vecinos.push(getCelula(coordenada.x + 1, coordenada.y - 1));
        vecinos.push(getCelula(coordenada.x + 1, coordenada.y));
        vecinos.push(getCelula(coordenada.x + 1, coordenada.y + 1));
        return vecinos;
    }

    const ContarVecinosVivos = (celula: Cell): number => {
        let contadorVecinos: number = 0;
        let vecinos: Cell[] = obtenerCelulasVecinas(celula);
        vecinos.forEach((vecino) => {
            if (vecino.getId() !== -1 && vecino.getEstado() === ESTADO_CELULA.VIVA) {
                contadorVecinos++;
            }
        });
        return contadorVecinos;
    }

    const asignarColonia = (celula: Cell, padre?: Cell): void => {
        if (padre) {
            celula.setColonia(padre.getColonia());
            return;
        }
        let colonia = Math.floor(Math.random() * (255));
        celula.setColonia(colonia);
    }

    const detectarColonias = () => {
        recorrer(cells, (cell) => {
            detectarColonia(cell)
            return cell
        })
    }

    const detectarColonia = (celula: Cell, padre?: Cell): void => {
        let vecinas: Cell[];
        if (celula.getColonia() !== -1) {
            return;
        }
        if (celula.getEstado() === ESTADO_CELULA.MUERTA) {
            return;
        }

        const isCell = padre instanceof Cell
        const newParent = isCell ? padre : undefined
        asignarColonia(celula, newParent);
        vecinas = obtenerCelulasVecinas(celula);
        vecinas.forEach(function (vecina) {
            let esValida = esCelulaVecinaValida(vecina, newParent);
            if (esValida) {
                detectarColonia(vecina, celula);
            }
        });
    }

    const exterminarVida = (): void => {
        const newCells = recorrer(cells, (celula: Cell) => {
            celula.setEstado(ESTADO_CELULA.MUERTA);
            return celula
        });

        setCells(newCells)
        setGenerations(0)
    }

    const generarVida = (): void => {
        const newCells = recorrer(cells, (cell) => {
            let estado = ESTADO_CELULA.VIVA;
            if (Utils.generarNumeroRandom(0, 1) === 0) {
                estado = ESTADO_CELULA.MUERTA;
            }
            cell.setEstado(estado);

            return cell
        })
        tick()

        setCells(newCells)
    }

    const reiniciarColonia = () => {
        const newCells = recorrer(cells, (celula: Cell) => {
            let vecinos = ContarVecinosVivos(celula);
            celula.setFantasma(celula.calcularEstado(vecinos));
            celula.setColonia(-1); // Reinica la colonia
            return celula
        })

        setCells(newCells)
    }

    const desfasarColonia = () => {
        const newCells = recorrer(cells, (celula: Cell) => {
            celula.desfasar();
            return celula
        })
        setCells(newCells)
    }
    const tick = (): void => {
        // this.cantidadColonias = 0;
        reiniciarColonia();
        desfasarColonia();
        // this.mapa.recorrer(this.mapa.detectarColonia.bind(this.mapa));
        detectarColonias();
        setGenerations((generation) => {
            return generation + 1
        });
    }

    const play = () => {
        const interval = window.setInterval(() => {
            tick()
        })

        setInterval(interval)
    }

    const stop = () => {
        window.clearInterval(interval)
    }


    return (
        <div>
            <div>
                <button onClick={generarVida}>Generate life</button>
            </div>

            <div>
                <button onClick={tick}>Tick</button>
            </div>

            <div>
                <button onClick={exterminarVida}>Exterminate</button>
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