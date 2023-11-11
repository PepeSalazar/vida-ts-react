export type CellConfig = {
    amountOfColonies: number;
    generations: number;
    cellSize: number;
    intracellularSpace: number;
    lifePercentage: number;
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
    amountOfColonies: 0,
    generations: 0,
    cellSize: 4,
    intracellularSpace: 0,
    lifePercentage: 0.4,
}

export const DEFAULT_UNIVERSE_CONFIG: UniverseConfig = {
    mapConfig: DEFAULT_MAP_CONFIG,
    cellConfig: DEFAULT_CELL_CONFIG
}