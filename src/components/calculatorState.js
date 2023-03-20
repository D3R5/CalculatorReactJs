import { Children, createContext, useContext, useState } from "react"


const AppContext = createContext({
    //estados
    memory: null,
    operation: null,
    currentValue: 0,
    isDecimal: false,
    //métodos
    addNumber:(value) => {},
    addOperation:(value) => {},
    getResult:() => {},
    executeAction:(action) => {},
});

export default function CalculatorState({children}) {
    const [memory, setMemory] = useState(null);
    const [operation, setOperation] = useState(null);
    const [currentValue, setCurrentValue] = useState(0);
    const [isReset, setIsReset] = useState(0);
    const [isDecimal, setIsDecimal] = useState(false);
    
    function handleAddNumber(value){
        if(isReset){
            if(value === "."){
                setIsDecimal(true);
            }else{
                //para validar si tengo o no el punto
            const point = isDecimal ? '.' : '';
            const newValue = currentValue.toString() + point + value.toString();
            setCurrentValue(parseFloat(newValue));
            setIsReset(false);  
            setIsDecimal(false);
            }
            setCurrentValue(parseInt(value));
            setIsReset(false);
        }else{
            if(value === ".") {
                setIsDecimal(true);
            }else {
                const point = isDecimal ? '.' : '';
                const newValue = currentValue.toString() + point + value.toString();
                setCurrentValue(parseFloat(newValue));
                setIsDecimal(false);
            }
        }
    }
    function handleAddOperation(op){
        if(currentValue){
            if(operation){
                //si se registra una operación, hay que resolver
                handleGetResult(); 
                setOperation(op);
            }else{
                setOperation(op);
                setMemory(currentValue);
                setCurrentValue(0);
                setIsReset(true);
            }
        }
    }
    function handleGetResult(){
        let result = 0 ;
        if (currentValue && operation && memory){
            switch(operation){
                case '+':
                    result = parseFloat(currentValue) + parseFloat(memory);
                    break;
                case '-':
                    result = parseFloat(memory) - parseFloat(currentValue);
                    break;
                case 'x':
                    result = parseFloat(currentValue) * parseFloat(memory);
                    break;
                case '÷':
                    result = parseFloat(memory) / parseFloat(currentValue);
                    break;
                case '%':
                    result = parseFloat(memory)/100 % parseFloat(currentValue);
                    break;
                default:
            }
            setCurrentValue(result);
            setOperation(null);
            setMemory(result);
            setIsReset(true);
            setIsDecimal(false);
        }
    }
    function cleanNumber(){
        setCurrentValue(0);
        setOperation(null);
        setMemory(0);
        setIsReset(true);
        setIsDecimal(false); //para borrar números como por ejemplo: 0.1, 0.6, 0.72, etc.
    }
    function deleteNumber(){
        const index = currentValue.toString().indexOf(".");
        if(index > 0){ //es un número decimal
            const numberOfDecimals = currentValue.toString().slice(index + 1).length;
            if(numberOfDecimals === 1){
                const min = Math.floor(currentValue);
                setCurrentValue(min);
            }else{ //si tiene más de un decimal, puedo seguir extranyendo decimales
                const newNumber = parseFloat(currentValue).toFixed(numberOfDecimals - 1);
                setCurrentValue(newNumber);
            }
        }else{ // es un número entero
            setCurrentValue(parseInt(currentValue / 10));
        }
    }
    function changeSign(){
        setCurrentValue(currentValue * -1);//con el * -1 invierto los signos 
    }
    function floatNumber(){
        if(currentValue.toString().indexOf(".") > 0){
            // signfica que el número ya es flotante
        }else{
            handleAddNumber(".");
            //lo convierte en flotante
        }
    }
    function handleExecuteAction(action){
        switch(action){
            case '=':
                handleGetResult();
                break;
            case 'AC':
                cleanNumber();
                break;
            case '<=':
                deleteNumber();
                break;
            case '+/-':
                changeSign();
                break;
            case '.':
                floatNumber();
                break;
            default:
        }
    }

    return (
        <AppContext.Provider value={{
            memory,
            operation,
            currentValue,
            isDecimal,
            addNumber: handleAddNumber,
            addOperation: handleAddOperation,
            getResult: handleGetResult,
            executeAction: handleExecuteAction,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext(){
    return useContext(AppContext);
}