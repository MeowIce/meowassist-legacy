const Filter = require("bad-words");
const filter = new Filter({
	list: require("vietnamese-badwords").array,
});

const name = "máy tính";
console.log(filter.isProfane(name));

const secondExp = /cặc|má/;
console.log(secondExp);
const text = "máy tính";
console.log(text.match(secondExp));
