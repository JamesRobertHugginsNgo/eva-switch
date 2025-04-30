type GenericDefault<T> = (callback: (value: any) => void) => T;
type GenericDo<T> = (callback: (value: any, result: any, caseId?: string) => void) => T;
type GenericCase<T> = (evaluate: (value: any) => any | RegExp, caseId?: string) => T;

// ==
// IGNORE
// ==

type IgnoreResult = {
	default: IgnoreDefault,
	do: IgnoreDo,
	case: IgnoreCase
};
const ignoreResult: IgnoreResult = {
	default: makeIgnoreDefault(),
	do: makeIgnoreDo(),
	case: makeIgnoreCase()
};

type IgnoreDefault = GenericDefault<IgnoreResult>;
function makeIgnoreDefault(): IgnoreDefault {
	return function ignoreDefault(callback: (value: any) => void): IgnoreResult {
		return ignoreResult;
	};
}

type IgnoreDo = GenericDo<IgnoreResult>;
function makeIgnoreDo(): IgnoreDo {
	return function ignoreDo(callback: (value: any, result: any, caseId?: string) => void): IgnoreResult {
		return ignoreResult;
	};
}

type IgnoreCase = GenericCase<IgnoreResult>;
function makeIgnoreCase(): IgnoreCase {
	return function ignoreCase(evaluate: (value: any) => any | RegExp, caseId?: string): IgnoreResult {
		return ignoreResult;
	};
}

// ==
// PASS
// ==

type PassDoResult = {
	default: ExecDefault,
	do: PassDo,
	case: ExecCase
};
type PassDo = GenericDo<PassDoResult>;
function makePassDo(value: any): PassDo {
	return function passDo(callback: (_value: any, result: any, caseId?: string) => void): PassDoResult {
		return {
			default: makeExecDefault(value),
			do: passDo,
			case: makeExecCase(value)
		};
	};
}

type PassCaseResult = {
	default: ExecDefault,
	do: ExecDo,
	case: PassCase
};
type PassCase = GenericCase<PassCaseResult>;
function makePassCase(value: any, result: any, caseId?: string): PassCase {
	return function passCase(evaluate: (value: any) => any | RegExp, _caseId?: string): PassCaseResult {
		return {
			default: makeExecDefault(value),
			do: makeExecDo(value, result, caseId),
			case: passCase
		};
	};
}

// ==
// EXEC
// ==

type ExecDefault = GenericDefault<IgnoreResult>;
function makeExecDefault(value: any): ExecDefault {
	return function execDefault(callback: (value: any) => void): IgnoreResult {
		callback(value);
		return ignoreResult;
	};
}

type ExecDo = GenericDo<IgnoreResult>;
function makeExecDo(value: any, result: any, caseId?: string): ExecDo {
	return function execDo(callback: (value: any, result: any, caseId?: string) => void): IgnoreResult {
		callback(value, result, caseId);
		return ignoreResult;
	};
}

type ExecCaseResult = {
	default: ExecDefault,
	do: ExecDo,
	case: PassCase
} | {
	default: ExecDefault,
	do: PassDo,
	case: ExecCase
};
type ExecCase = GenericCase<ExecCaseResult>;
function makeExecCase(value: any): ExecCase {
	return function execCase(evaluate: (value: any) => any | RegExp, caseId?: string): ExecCaseResult {
		let result: any = null;
		if (evaluate instanceof RegExp) {
			result = evaluate.exec(String(value));
		} else {
			result = evaluate(value);
		}

		if (result == null || result === false) {
			return {
				default: makeExecDefault(value),
				do: makePassDo(value),
				case: execCase
			};
		}
		return {
			default: makeExecDefault(value),
			do: makeExecDo(value, result, caseId),
			case: makePassCase(value, result, caseId)
		};
	};
}

// ==
// EVA SWITCH
// ==

type EvaSwitchResult = {
	default: ExecDefault,
	do: PassDo,
	case: ExecCase
};
export default function evaSwitch(value: any): EvaSwitchResult {
	return {
		default: makeExecDefault(value),
		do: makePassDo(value),
		case: makeExecCase(value)
	};
}
