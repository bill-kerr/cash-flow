import React from 'react';

export default ({ occurrence, balance }) => {
  return (
    <tr className="text-sm">
      <td className="py-2 pl-4">{ occurrence.date }</td>
      <td className="py-2 pl-2">{ occurrence.description }</td>
      <td className="py-2">{ occurrence.amount }</td>
      <td className="py-2">{ balance }</td>
    </tr>
  );
};