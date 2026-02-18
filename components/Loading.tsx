
import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-500"></div>
        </div>
    );
};

export default Loading;
