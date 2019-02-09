import { FLASH_GREEN_SET, FLASH_RED_SET } from '../constants';
import { AnyAction } from 'redux';

export interface IFlashState {
	msgGreen: string;
	msgRed: string;
}

export const initialState: IFlashState = {
	msgGreen: '',
	msgRed: ''
};

export default (state = initialState, action: AnyAction) => {
	switch (action.type) {
		case FLASH_GREEN_SET: {
			return {
				...state,
				msgGreen: action.msgGreen
			};
		}
		case FLASH_RED_SET: {
			return {
				...state,
				msgRed: action.msgRed
			};
		}
		default:
			return state;
	}
};
