export type CellConfig = {
    cantidadColonias: number;
    generaciones: number;
    tamanoCelula: number;
    espacioCelular: number;
    porcentajeVida: number;
}

export type MapConfig = {
    rows: number;
    columns: number;
}

export type UniverseConfig = {
    cellConfig: CellConfig
    mapConfig: MapConfig
}

export const DEFAULT_MAP_CONFIG: MapConfig = {
    rows: 200,
    columns: 200,
}

export const DEFAULT_CELL_CONFIG: CellConfig = {
    cantidadColonias: 0,
    generaciones: 0,
    tamanoCelula: 4,
    espacioCelular: 0,
    porcentajeVida: 0.4,
}

export const DEFAULT_UNIVERSE_CONFIG: UniverseConfig = {
    mapConfig: DEFAULT_MAP_CONFIG,
    cellConfig: DEFAULT_CELL_CONFIG
}