import { NativeModules } from 'react-native';

// https://developers.google.com/ml-kit/reference/android

export type Point = {
  x: number;
  y: number;
};
/**
 * The four corner points of the text block / line / element in
 * clockwise order starting with the top left
 * point relative to the image in the default
 * coordinate space.
 **/
export type CornerPoints = Array<Point | null>;

/**
 * The rectangle that contains the text block / line / element
 * relative to the image in the default coordinate space.
 */
export type Bounding = {
  left: number;
  top: number;
  height: number;
  width: number;
};

/**
 * A text element recognized in an image.
 * A text element is roughly equivalent to
 * a space-separated word in most Latin-script languages.
 */
export type MLKTextElement = {
  text: string;
  cornerPoints: CornerPoints;
  bounding: Bounding;
};

/**
 *  A text line recognized in an image that consists of an array of elements.
 * */
export type MLKTextLine = {
  text: string;
  elements: Array<MLKTextElement>;
  cornerPoints: CornerPoints;
  bounding: Bounding;
};

/**
 * A text block recognized in an image that consists of an array of text lines.
 */
export type MKLBlock = {
  text: string;
  lines: MLKTextLine[];
  cornerPoints: CornerPoints;
  bounding: Bounding;
};

export type OcrResult = MKLBlock[];

type OcrModule = {
  detectFromUri(uri: string): Promise<OcrResult>;
  detectFromFile(path: string): Promise<OcrResult>;
};

const ocrModule: OcrModule = NativeModules.Ocr;

const Ocr: OcrModule = {
  detectFromUri: async (uri: string) => {
    const result = await ocrModule.detectFromUri(uri);
    if (!result) {
      return [];
    }
    return result;
  },
  detectFromFile: async (path: string) => {
    const result = await ocrModule.detectFromFile(path);
    if (!result) {
      return [];
    }
    return result;
  },
};

export default Ocr;
