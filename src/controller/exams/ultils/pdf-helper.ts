import { PDFExtract, PDFExtractText } from "pdf.js-extract";
import { IQuest } from "../../../helper/type.helper";

const rexAnswer = new RegExp(/^(A|B|C|D){1}?\:$/g);

export const pdfExtractOffset = async (buffer: Buffer) => {
  const offsetQuiz: IQuest[][] = [];
  const pdfExtract = new PDFExtract();

  const pdf = await pdfExtract.extractBuffer(buffer).catch((error) => {
    console.log(`[Pdf extract error]:\n${error}`);
    return null;
  });
  if (pdf == null) return undefined;

  pdf.pages.forEach((page) => {
    const offsetInPage = getContentInPage(page.content);
    offsetQuiz.push(offsetInPage);
  });
  return offsetQuiz;
};

const getContentInPage = (page: PDFExtractText[]) => {
  let questOffset: IQuest = Object.create({});
  const offsetInPage: IQuest[] = [];
  page.forEach((content, i) => {
    const { x, y, str } = content;
    if (str.includes("Câu ")) {
      offsetInPage.push(questOffset);
      questOffset = { ask: { x, y }, answer: [] };
      return;
    }
    if (
      rexAnswer.test(str) ||
      rexAnswer.test(`${str}${page[i + 1]?.str ?? ""}`)
    ) {
      questOffset.answer.push({ x, y });
      return;
    }
  });
  offsetInPage.shift();
  offsetInPage.push(questOffset);
  return offsetInPage;
};
