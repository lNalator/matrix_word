export interface RainDrop {
  x: number;
  y: number;
  // lineIndex: number;
  // lastDropTime: number;
  speed: number;
  text: string;
  opacity: number;
}

export interface AsciiArtConfig {
  text: string;
  fontSize: number;
  charWidth: number;
  charHeight: number;
}

export interface MatrixRainConfig {
  text: string;
  color: string;
  speed: number;
  density: number;
}