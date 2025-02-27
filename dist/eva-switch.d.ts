type EVA_SWITCH_DEFAULT_CALLBACK = (value: any) => void;
type EVA_SWITCH_DEFAULT = (callback: EVA_SWITCH_DEFAULT_CALLBACK) => void;
type EVA_SWITCH_CASE_EVALUATE = (value: any) => any;
type EVA_SWITCH_CASE_RETURN = {
	default: EVA_SWITCH_DEFAULT;
	case: EVA_SWITCH_CASE;
	do: EVA_SWITCH_DO;
};
type EVA_SWITCH_CASE = (
	evaluate: RegExp | EVA_SWITCH_CASE_EVALUATE,
	caseId: any,
) => EVA_SWITCH_CASE_RETURN;
type EVA_SWITCH_DO_CALLBACK = (value: any, result: any, caseId: any) => void;
type EVA_SWITCH_DO_RETURN = {
	default: EVA_SWITCH_DEFAULT;
	case: EVA_SWITCH_CASE;
};
type EVA_SWITCH_DO = (callback: EVA_SWITCH_DO_CALLBACK) => EVA_SWITCH_DO_RETURN;
export default function evaSwitch(value: any): EVA_SWITCH_DO_RETURN;
export {};
