import React from "react";
import Front from '../front/front';
import Programs from '../Programs/Programs';
import Reasons from '../Reasons/Reasons';
import Plans from '../Plans/Plans';
import Testimonial from '../Testimonial/Testimonial';
import Join from '../Join/Join';
import Footer from '../Footer/Footer';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            <Front />
            <Programs />
            <Reasons />
            <Plans />
            <Testimonial />
            <Join />
            <Footer />
        </div>
    );
};

export default Home;