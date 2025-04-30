const ignoreResult = {
	default: makeIgnoreDefault(),
	do: makeIgnoreDo(),
	case: makeIgnoreCase(),
};
function makeIgnoreDefault() {
	return function ignoreDefault(callback) {
		return ignoreResult;
	};
}
function makeIgnoreDo() {
	return function ignoreDo(callback) {
		return ignoreResult;
	};
}
function makeIgnoreCase() {
	return function ignoreCase(evaluate, caseId) {
		return ignoreResult;
	};
}
function makePassDo(value) {
	return function passDo(callback) {
		return {
			default: makeExecDefault(value),
			do: passDo,
			case: makeExecCase(value),
		};
	};
}
function makePassCase(value, result, caseId) {
	return function passCase(evaluate, _caseId) {
		return {
			default: makeExecDefault(value),
			do: makeExecDo(value, result, caseId),
			case: passCase,
		};
	};
}
function makeExecDefault(value) {
	return function execDefault(callback) {
		callback(value);
		return ignoreResult;
	};
}
function makeExecDo(value, result, caseId) {
	return function execDo(callback) {
		callback(value, result, caseId);
		return ignoreResult;
	};
}
function makeExecCase(value) {
	return function execCase(evaluate, caseId) {
		let result = null;
		if (evaluate instanceof RegExp) {
			result = evaluate.exec(String(value));
		} else {
			result = evaluate(value);
		}
		if (result == null || result === false) {
			return {
				default: makeExecDefault(value),
				do: makePassDo(value),
				case: execCase,
			};
		}
		return {
			default: makeExecDefault(value),
			do: makeExecDo(value, result, caseId),
			case: makePassCase(value, result, caseId),
		};
	};
}
export default function evaSwitch(value) {
	return {
		default: makeExecDefault(value),
		do: makePassDo(value),
		case: makeExecCase(value),
	};
}
