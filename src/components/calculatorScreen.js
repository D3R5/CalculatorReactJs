import { useAppContext } from "./calculatorState";
import "./calculator.css"

export default function CalculatorScreen(){
    const calculator = useAppContext();
    return(
        <div className="calculatorScreen">
            <div className="calculatorScreenWords">
                <span>REACT JS - CALCULATOR</span>
                <br/>
                <span>Ans = {calculator.memory}</span>
            </div>
            <div className="calculatorCurrentValue">
                {calculator.currentValue}
                {calculator.isDecimal?'.' :''}
            </div>
        </div>
    );
}