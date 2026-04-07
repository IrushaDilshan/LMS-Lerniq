import React from 'react';
import TicketSubmissionForm from '../tickets/TicketSubmissionForm';
import TicketList from '../tickets/TicketList';

const TicketDashboard = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-[#061224] tracking-tight">Maintenance Tickets</h1>
        <p className="text-gray-500 mt-2">Manage facility and equipment repairs across the campus.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <TicketSubmissionForm />
        </div>
        <div className="xl:col-span-2">
          <TicketList />
        </div>
      </div>
    </div>
  );
};

export default TicketDashboard;
