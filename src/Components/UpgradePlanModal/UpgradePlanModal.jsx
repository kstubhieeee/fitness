import React from 'react';

const UpgradePlanModal = ({ isOpen, onClose, plans, onSelectPlan }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
                <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>X</button>
                <div className="mt-4">
                    {plans.map((plan) => (
                        <div key={plan.name} className="border p-4 rounded-lg mb-4">
                            <h3 className="text-lg font-bold">{plan.name}</h3>
                            <p className="text-gray-700">Price: ₹{plan.price}</p>
                            <button
                                onClick={() => onSelectPlan(plan)}
                                className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
                            >
                                Select Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UpgradePlanModal; 