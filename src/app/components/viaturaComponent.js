import StartButton from './startButton';

const ViaturaComponent = ({ viatura }) => {
    console.log("Viatura recebida:", viatura);
    return (
        <div>
            <StartButton viatura={viatura} /> 
        </div>
    );
};

export default ViaturaComponent;
