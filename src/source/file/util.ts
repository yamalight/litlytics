import mammoth from 'mammoth/mammoth.browser';
import Papa from 'papaparse';
import * as pdfjs from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set the workerSrc to use the worker from node_modules
const src = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url);
pdfjs.GlobalWorkerOptions.workerSrc = src.toString();

export const supportedFileTypes = ['.csv', '.doc', '.docx', '.pdf', '.txt'];

const parseCsvFile = (file: File): Promise<string[]> =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      error(error) {
        reject(error);
      },
      complete(results) {
        const data = results.data as Record<string, string>[];
        const output = data.map((obj) =>
          Object.keys(obj)
            .map((key: string) => `${key}: ${obj[key]}`)
            .join('\n')
        );
        resolve(output);
      },
    });
  });

const parseDocFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onloadend = function () {
      const arrayBuffer = reader.result;
      if (!arrayBuffer) {
        reject(new Error('Error parsing pdf file - no data returned'));
        return;
      }
      mammoth
        .convertToMarkdown({ arrayBuffer: arrayBuffer as ArrayBuffer })
        .then(function (resultObject) {
          // cleanup double backslashes escapes for dots
          const cleanedValue = resultObject.value.replaceAll('\\.', '.');
          resolve(cleanedValue);
        })
        .catch((err) => reject(err));
    };
    reader.readAsArrayBuffer(file);
  });

const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });

const parsePdfFile = async (file: File): Promise<string> => {
  // Load the PDF document
  const pdf = await pdfjs.getDocument(await file.bytes()).promise;

  let textContent = '';
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    // Get the page
    const page = await pdf.getPage(pageNumber);

    // Extract text content
    const content = await page.getTextContent();
    const strings = content.items.map((item) => (item as TextItem).str);
    textContent += strings.join(' ') + ' ';
  }

  return textContent;
};

export const getFileContent = async (
  file: File
): Promise<string | string[] | undefined> => {
  if (file.name.endsWith('.csv')) {
    const content = await parseCsvFile(file);
    return content;
  }
  if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
    const content = await parseDocFile(file);
    return content;
  }
  if (file.name.endsWith('.pdf')) {
    const content = await parsePdfFile(file);
    return content;
  }
  if (file.name.endsWith('.txt')) {
    const content = await readFileAsText(file);
    return content;
  }
};
