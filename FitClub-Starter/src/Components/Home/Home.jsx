import React from "react";
import Front from '../front/front';
import Programs from '../Programs/Programs';
import Reasons from '../Reasons/Reasons';
import Plans from '../Plans/Plans';
import Testimonial from '../Testimonial/Testimonial';
import Join from '../Join/Join';
import Footer from '../Footer/Footer';
import './Home.css';


const Home = () => {
    return (
        <div className="Apps">
            <>

                <Front />
                <Programs />
                <Reasons />
                <Plans />
                <Testimonial />
                <Join />
                <Footer />
            </>
        </div>

    );
};

export default Home;