import StartButton from './startButton';

const ViaturaComponent = ({ viatura }) => {
    console.log("Viatura recebida:", viatura);
    return (
        <div>
            <StartButton viaturas={[viatura]} /> 
        </div>
    );
};

export default ViaturaComponent;