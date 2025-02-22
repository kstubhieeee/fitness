import React from 'react'
import './Reasons.css'
import image1 from '../../assets/image1.png'
import image2 from '../../assets/image2.png'
import image3 from '../../assets/image3.png'
import image4 from '../../assets/image4.png'
import tick from '../../assets/tick.png'
import nike from '../../assets/nike.png'
import adidas from '../../assets/adidas.png'
import nb from '../../assets/nb.png'

const Reasons = () => {
    return (
        <div className="Reasons" id='reasons'>
            <div className="left-r">
                <img src={image1} alt="" />
                <img src={image2} alt="" />
                <img src={image3} alt="" />
                <img src={image4} alt="" />
            </div>
            <div className="right-r">
                <span>Some Reasons</span>
                <div>
                    <span className='stroke-text'>why</span>
                    <span>choose us?</span>
                </div>

                <div className='details-r'>
                    <div><img src={tick} alt=""></img><span>over 100+ expert coaches</span></div>
                    <div><img src={tick} alt="" /><span>train smarter and faster than before</span></div>
                    <div><img src={tick} alt="" /><span>1 free program for new members</span></div>
                    <div><img src={tick} alt="" /><span>reliable partners</span></div>
                </div>
                <span style={{ color: 'orange' }}>our partners</span>
                <div className='partners'>
                    <img src={nike} alt="" />
                    <img src={adidas} alt="" />
                    <img src={nb} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Reasons