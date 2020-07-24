import React from 'react';
import { formatCurrency } from '../util';

const symbol = {
  'positive': <path d="M12 4v16m8-8H4"></path>,
  'negative': <path d="M18 12H6"></path>
};

const TransactionBadge = ({ 
  amount = 0,
  type = amount >= 0 ? 'positive' : 'negative',
  currencyCode,
  bold = true,
  positiveTextStyle = 'text-green-800',
  negativeTextStyle = 'text-red-800',
  positiveSymbolStyle = 'text-green-800',
  negativeSymbolStyle = 'text-red-800',
}) => {
  const symbol = {
    'positive': <path d="M12 4v16m8-8H4"></path>,
    'negative': <path d="M18 12H6"></path>
  }[type];

  const symbolStyle = {
    'positive': positiveSymbolStyle,
    'negative': negativeSymbolStyle
  }[type];

  const textStyle = {
    'positive': positiveTextStyle,
    'negative': negativeTextStyle
  }[type];

  return (
    <div className={ `flex items-center ${ bold ? 'font-bold' : '' }` }>
      <span className="flex items-center justify-between">
        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" viewBox="0 0 24 24" 
          stroke="currentColor" className={ `h-3 w-3 ${ symbolStyle }` }
        >
         { symbol }
        </svg>
        
      </span>
      <span className={ `ml-1 ${ textStyle }` }>
        { formatCurrency(amount, currencyCode, true) }
      </span>
    </div>
  );
};

export default TransactionBadge;