export function blobToURL(blob: Blob): string {
    return URL.createObjectURL(blob);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) throw new Error("Canvas export failed");
            resolve(blob);
        }, "image/png");
    });
}