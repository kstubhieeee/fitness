import React from "react";
import "./planspage.css";

const Planspage = () => {
    const plans = [
        {
            name: "Basic Plan",
            price: "$25",
            features: ["Access to gym", "Standard equipment", "1 free trainer session"],
        },
        {
            name: "Premium Plan",
            price: "$30",
            features: ["Access to gym", "All equipment", "3 free trainer sessions", "Sauna access"],
        },
        {
            name: "Pro Plan",
            price: "$45",
            features: ["Access to gym", "All equipment", "Unlimited trainer sessions", "Sauna & spa access", "Diet plan"],
        },
    ];

    return (
        <div className="pricing-container">
            <h1 className="pricing-title">Choose Your Plan</h1>
            <div className="plans-wrapper">
                {plans.map((plan, index) => (
                    <div className="plan-card" key={index}>
                        <h2 className="plan-name">{plan.name}</h2>
                        <h3 className="plan-price">{plan.price}</h3>
                        <ul className="plan-features">
                            {plan.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                        <button className="proceed-btn">Proceed to Payment</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Planspage;