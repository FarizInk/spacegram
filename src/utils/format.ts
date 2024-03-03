interface CaptionType {
	[key: string]: string;
}

export const generate = (obj: CaptionType) => {
	let result = '';
	Object.keys(obj).forEach((key) => (result = result + `${key}: ${obj[key]}\r\n`));
	return result;
};

export const get = (info: string, key: string | null) => {
	let obj = {};
	const infoToArray = info.split('\n');
	for (let i = 0; i < infoToArray.length; i++) {
		const text = infoToArray[i].split(':');
		if (text.length === 2) {
			if (key === null) {
				obj = {
					...obj,
					[text[0].trim()]: text[1].trim()
				};
			} else if (text[0].trim() === key) {
				return text[1].trim();
			}
		}
	}

	return key === null ? obj : null;
};
