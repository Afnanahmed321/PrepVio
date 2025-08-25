const AboutUs = () => {
    return (
        <div id='aboutus' className='container  rounded-full mx-auto px-6 py-12 md:py-24 text-center bg-white'>
            {/* About Us Section */}
            <div className='sm:block justify-items-center p-6'>
                <h1 className='text-3xl sm:text-4xl font-bold'>About Us</h1>
                <div className='text-center px-2 py-6 sm:text-2xl font-thin justify-items-center sm:p-6'>
                    <p>Welcome to PrepVio, where learning has no limits !</p>
                    <p>We provide higher-quality and career-focused platform to prepare for your interviews.</p>
                    <p>Analyse & upgrade their skills and achieve their goals.</p>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className='py-4 px-6 lg:px-30'>
                <h1 className='text-3xl text-center sm:text-4xl font-extrabold mb-9 font-family whitespace-nowrap'>Why Choose Us?</h1>
                <div className='flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10'>
                    {/* Card 1: Real-Time AI Avatar */}
                    <div className='sm:py-4 sm:h-75 md:block lg:h-66 w-72 border rounded-2xl shadow-lg px-2 py-7 text-center transform transition-transform hover:scale-105'>
                        <h2 className='font-thin text-3xl/8 mb-5 underline decoration-1 underline-offset-4'>Real-Time AI Avatar</h2>
                        <p className='text-xl/6'>Experience human-like interviews with our interactive AI avatar,
                        making the process natural and engaging.</p>
                    </div>

                    {/* Card 2: AI-Powered Analysis */}
                    <div className='sm:py-3 sm:h-75 md:block lg:h-66 w-72 border rounded-2xl shadow-lg px-2 py-7 text-center transform transition-transform hover:scale-105'>
                        <h2 className='font-thin text-3xl mb-3 underline decoration-1 underline-offset-4'>AI-Powered Analysis</h2>
                        <p className='text-xl/6'>Our AI evaluates speech clarity, sentiment, confidence, and relevence,
                        providing deep performance insights.</p>
                    </div>

                    {/* Card 3: Automated Report */}
                    <div className='sm:py-4 sm:h-75 md:block lg:h-66 w-72 border rounded-2xl shadow-lg px-4 py-7 text-center transform transition-transform hover:scale-105'>
                        <h2 className='font-thin text-3xl mb-3 underline decoration-1 underline-offset-4'>Automated <br/>Report</h2>
                        <p className='text-xl/6'>Get detailed AI-driven feedback on strengths, weaknesses, and improvement areas instantly.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
