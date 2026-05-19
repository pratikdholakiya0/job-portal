const StatusMessage = ({ message, type, onClose }) => {
    if (!message) return null;
    const colors = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
    };
    return (
        <div className={`p-4 rounded-xl border mb-6 shadow-md ${colors[type] || colors.info}`} role="alert">
            <div className="flex justify-between items-center">
                <p>{message}</p>
                <button onClick={onClose} className="text-lg font-bold">
                    &times;
                </button>
            </div>
        </div>
    );
};

export default StatusMessage