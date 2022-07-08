const exp =
	/^(([aeiouy]\u0308)|[\u0300-\u036f\u0489])|[\u0000-\u007fÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]|[^\x00-\x7F]/gi;

const text = "cam da nhi đồng";
const matches = text.match(exp);
const percentage = (matches.length / text.length) * 100;
console.log(percentage);
if (percentage < 80) {
	console.log("fail");
} else {
	console.log("pass");
}
