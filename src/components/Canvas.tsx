import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import {Cell} from "@/models/Cell";

type CanvasProps = {
    width: number
    height: number
    cells: Cell[][]
};

export const Canvas = (props: CanvasProps) => {
    const {width, height, cells} = props
    const canvasRef = useRef(null);

    useEffect(() => {
        renderCells()
    }, [cells])

    const renderCells = () => {
        const canvas = canvasRef.current;
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        cells.forEach((row) => {
            row.forEach((cell) => {
                cell.render(ctx)
            })
        })
    }

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{border: '1px solid black'}}
        />
    );
};
;