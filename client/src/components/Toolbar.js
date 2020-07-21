import React, { useState } from 'react';
import Modal from './Modal';
import CreateScheduleForm from './schedules/CreateScheduleForm';

const Toolbar = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="flex items-center">
      <button
        onClick={ () => setCreateModalOpen(!createModalOpen) } 
        className="py-2 px-3 bg-blue-100 border border-blue-300 rounded shadow flex items-center hover:bg-blue-200 focus:outline-none text-blue-900"
      >
        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
          stroke="currentColor" className="h-4 w-4"
        >
          <path d="M12 4v16m8-8H4"></path>
        </svg>
        <span className="ml-1 text-sm font-bold">Add Transaction</span>
      </button>
      <button 
        className="ml-3 py-2 px-3 bg-white border border-gray-300 rounded flex items-center hover:bg-gray-200 focus:outline-none text-gray-900"
      >
        <span className="ml-1 text-sm">View All Transactions</span>
      </button>

      <Modal 
        show={ createModalOpen } 
        dismiss={ () => setCreateModalOpen(false) }
      >
        <CreateScheduleForm dismiss={ () => setCreateModalOpen(false) } />
      </Modal>
    </div>
  );
};

export default Toolbar;