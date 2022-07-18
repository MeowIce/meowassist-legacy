const vietnameseBadWords = require("./bad-words");
const exp = new RegExp(
	`${vietnameseBadWords.map((w) => `\\B${w}\\B`).join("|")}`,
	"gi"
);
console.log(exp);

const name = "Má tính";
console.log(name.match(exp));

const secondExp = /\Bcặc\B|\Bmá\B/g;
console.log(secondExp);
const text = "má tính";
console.log(text.match(secondExp));
