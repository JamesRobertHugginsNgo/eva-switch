type GenericDefault<T> = (callback: (value: any) => void) => T;
type GenericDo<T> = (
	callback: (value: any, result: any, caseId?: string) => void,
) => T;
type GenericCase<T> = (
	evaluate: (value: any) => any | RegExp,
	caseId?: string,
) => T;
type IgnoreResult = {
	default: IgnoreDefault;
	do: IgnoreDo;
	case: IgnoreCase;
};
type IgnoreDefault = GenericDefault<IgnoreResult>;
type IgnoreDo = GenericDo<IgnoreResult>;
type IgnoreCase = GenericCase<IgnoreResult>;
type PassDoResult = {
	default: ExecDefault;
	do: PassDo;
	case: ExecCase;
};
type PassDo = GenericDo<PassDoResult>;
type PassCaseResult = {
	default: ExecDefault;
	do: ExecDo;
	case: PassCase;
};
type PassCase = GenericCase<PassCaseResult>;
type ExecDefault = GenericDefault<IgnoreResult>;
type ExecDo = GenericDo<IgnoreResult>;
type ExecCaseResult =
	| {
			default: ExecDefault;
			do: ExecDo;
			case: PassCase;
	  }
	| {
			default: ExecDefault;
			do: PassDo;
			case: ExecCase;
	  };
type ExecCase = GenericCase<ExecCaseResult>;
type EvaSwitchResult = {
	default: ExecDefault;
	do: PassDo;
	case: ExecCase;
};
export default function evaSwitch(value: any): EvaSwitchResult;
export {};
