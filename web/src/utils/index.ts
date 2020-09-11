import { CashFlowResponse, ErrorResponse } from '../apis/cash-flow/types';

export const isErrorResponse = (response: CashFlowResponse): response is ErrorResponse => response.object === 'error';
