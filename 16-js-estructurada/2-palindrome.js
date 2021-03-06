const { Console } = require("console-mpds");
const console = new Console();

const NOT_NORMALIZED = 0;
const NORMALIZED = 1;
const REPLACEMENTS = [
  [" ", "á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  [ "", "a", "e", "i", "o", "u", "a", "e", "i", "o", "u", 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
];

const text = console.readString("Escriba un palíndromo: ");

let normalizedText = "";
for (let i = 0; i < text.length; i++) {
  let letter = text[i];
  for (let j = 0; text[i] === letter && j < REPLACEMENTS[NOT_NORMALIZED].length; j++) {
    if (text[i] === REPLACEMENTS[NOT_NORMALIZED][j]) {
      letter = REPLACEMENTS[NORMALIZED][j];
    }
  }
  normalizedText += letter;
}

let isPalindrome = true;
for (let i = 0, j = normalizedText.length - 1; isPalindrome && i < j; i++, j--) {
  isPalindrome &&= normalizedText[i] === normalizedText[j];
}

console.writeln(
  `El texto "${text}" ${isPalindrome ? "sí" : "no"} es palíndromo.`
);
