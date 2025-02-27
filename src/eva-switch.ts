type EVA_SWITCH_DEFAULT_CALLBACK = (value: any) => void;
type EVA_SWITCH_DEFAULT = (callback: EVA_SWITCH_DEFAULT_CALLBACK) => void;

type EVA_SWITCH_CASE_EVALUATE = (value: any) => any;
type EVA_SWITCH_CASE_RETURN = { default: EVA_SWITCH_DEFAULT, case: EVA_SWITCH_CASE, do: EVA_SWITCH_DO };
type EVA_SWITCH_CASE = (evaluate: RegExp | EVA_SWITCH_CASE_EVALUATE, caseId: any) => EVA_SWITCH_CASE_RETURN;

type EVA_SWITCH_DO_CALLBACK = (value: any, result: any, caseId: any) => void;
type EVA_SWITCH_DO_RETURN = { default: EVA_SWITCH_DEFAULT, case: EVA_SWITCH_CASE };
type EVA_SWITCH_DO = (callback: EVA_SWITCH_DO_CALLBACK) => EVA_SWITCH_DO_RETURN;

export default function evaSwitch(value: any): EVA_SWITCH_DO_RETURN {
	function executableDefault(callback: EVA_SWITCH_DEFAULT_CALLBACK): void {
		callback(value);
	}

	function executableCase(evaluate: RegExp | EVA_SWITCH_CASE_EVALUATE, caseId: any): EVA_SWITCH_CASE_RETURN {
		if (evaluate instanceof RegExp) {
			evaluate = ((regex: RegExp): EVA_SWITCH_CASE_EVALUATE => {
				return (value: any): any => {
					if (typeof value === 'string') {
						return regex.exec(value);
					}
				};
			})(evaluate);
		}
		const result: any = evaluate(value);
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

	function makeExecutableDo(result: any, caseId: any): EVA_SWITCH_DO {
		return function executbleDo(callback: EVA_SWITCH_DO_CALLBACK): EVA_SWITCH_DO_RETURN {
			callback(value, result, caseId);
			return {
				default: ignoredDefault,
				case: ignoredCase
			};
		};
	}

	function makePassThroughCase(result: any, caseId: any): EVA_SWITCH_CASE {
		return function passThroughCase(ignoredEvaluate: RegExp | EVA_SWITCH_CASE_EVALUATE, ignoredCaseId: any): EVA_SWITCH_CASE_RETURN {
			return {
				default: executableDefault,
				case: makePassThroughCase(result, caseId),
				do: makeExecutableDo(result, caseId)
			};
		};
	}

	function passThroughDo(ignoredCallback: EVA_SWITCH_DO_CALLBACK): EVA_SWITCH_DO_RETURN {
		return {
			default: executableDefault,
			case: executableCase
		};
	}

	function ignoredDefault(ignoredCallback: EVA_SWITCH_DEFAULT_CALLBACK): void { }

	function ignoredCase(ignoredEvaluate: RegExp | EVA_SWITCH_CASE_EVALUATE, ignoredCaseId: any): EVA_SWITCH_CASE_RETURN {
		return {
			default: ignoredDefault,
			case: ignoredCase,
			do: ignoredDo
		};
	}

	function ignoredDo(ignoredCallback: EVA_SWITCH_DO_CALLBACK): EVA_SWITCH_DO_RETURN {
		return {
			default: ignoredDefault,
			case: ignoredCase
		};
	}

	return {
		default: executableDefault,
		case: executableCase
	};
}
