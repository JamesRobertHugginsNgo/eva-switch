/* BOILERPLATE */

export default function evaSwitch(value) {
	function executableDefault(callback) {
		callback(value);
	}

	function executableCase(evaluate, caseId) {
		if (evaluate instanceof RegExp) {
			evaluate = ((regex) => {
				return (value) => {
					return regex.exec(value);
				}
			})(evaluate);
		}
		const result = evaluate(value);
		if (result) {
			return {
				default: executableDefault,
				case: makePassThroughCase(result, caseId),
				do: makeExecutableDo(result, caseId)
			};
		}

		return {
			default: executableDefault,
			case: executableCase,
			do: passThroughDo
		};
	}

	function makeExecutableDo(result, caseId) {
		return function executbleDo(callback) {
			callback(value, result, caseId);
			return {
				default: ignoredDefault,
				case: ignoredCase
			}
		};
	}

	function makePassThroughCase(result, caseId) {
		return function passThroughCase() {
			return {
				default: executableDefault,
				case: makePassThroughCase(result, caseId),
				do: makeExecutableDo(result, caseId)
			}
		};
	}

	function passThroughDo() {
		return {
			default: executableDefault,
			case: executableCase
		};
	}

	function ignoredDefault() { }

	function ignoredCase() {
		return {
			default: ignoredDefault,
			case: ignoredCase,
			do: ignoredDo
		};
	}

	function ignoredDo() {
		return {
			default: ignoredDefault,
			case: ignoredDo
		};
	}

	return passThroughDo();
}
