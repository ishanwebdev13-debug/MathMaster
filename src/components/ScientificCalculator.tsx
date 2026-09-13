import { useState, useCallback } from "react";
import { Delete, X } from "lucide-react";

export default function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isDegrees, setIsDegrees] = useState(true);

  const evaluateMath = useCallback((expr: string, degrees: boolean) => {
    try {
      if (!expr.trim()) return "";
      
      // Basic sanitization
      let sanitized = expr.replace(/[^0-9+\-*/().,%sincotaleqrp^ ]/gi, '');
      // Replace symbols
      sanitized = sanitized.replace(/\^/g, '**');
      sanitized = sanitized.replace(/pi/gi, 'Math.PI');
      sanitized = sanitized.replace(/e/gi, 'Math.E');

      // Create math context
      const mathScope = {
        sin: (x: number) => degrees ? Math.sin(x * Math.PI / 180) : Math.sin(x),
        cos: (x: number) => degrees ? Math.cos(x * Math.PI / 180) : Math.cos(x),
        tan: (x: number) => degrees ? Math.tan(x * Math.PI / 180) : Math.tan(x),
        log: Math.log10,
        ln: Math.log,
        sqrt: Math.sqrt,
      };

      const keys = Object.keys(mathScope);
      const values = Object.values(mathScope);
      
      // Use Function constructor securely with only math scope
      const func = new Function(...keys, `return ${sanitized};`);
      const res = func(...values);
      
      if (typeof res !== 'number' || isNaN(res)) return "Error";
      
      // Format number, avoiding long trailing decimals for clean UI
      return Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(10)).toString();
    } catch (err) {
      return "Error";
    }
  }, []);

  const handleInput = (val: string) => {
    if (result !== null && result !== "Error") {
      // If there's a result and the user types an operator, continue with result
      if (["+", "-", "*", "/", "^"].includes(val)) {
        setExpression(result + val);
      } else {
        // Otherwise start fresh
        setExpression(val);
      }
      setResult(null);
    } else {
      setExpression((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setExpression("");
    setResult(null);
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
    if (result) setResult(null);
  };

  const handleCalculate = () => {
    const res = evaluateMath(expression, isDegrees);
    setResult(res);
  };

  const btnClass = "flex items-center justify-center p-3 rounded-xl font-medium text-sm transition-colors active:scale-95 select-none";
  const numClass = `${btnClass} bg-card border border-border text-foreground hover:bg-muted font-heading text-base`;
  const opClass = `${btnClass} bg-primary/10 text-primary font-bold hover:bg-primary/20`;
  const funcClass = `${btnClass} bg-muted text-foreground/80 hover:bg-muted/80 text-xs`;

  return (
    <div className="w-[320px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Display */}
      <div className="p-4 bg-card border-b border-border flex flex-col gap-1 min-h-[100px] justify-end">
        <div className="text-right text-sm text-foreground/60 min-h-[20px] font-mono truncate">
          {expression}
        </div>
        <div className="text-right text-3xl font-heading font-bold text-foreground min-h-[40px] truncate">
          {result !== null ? result : (expression || "0")}
        </div>
      </div>

      {/* Controls / Deg-Rad */}
      <div className="px-4 pt-3 flex justify-between items-center">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setIsDegrees(true)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${isDegrees ? 'bg-card text-foreground shadow-sm' : 'text-foreground/60'}`}
          >
            DEG
          </button>
          <button
            onClick={() => setIsDegrees(false)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${!isDegrees ? 'bg-card text-foreground shadow-sm' : 'text-foreground/60'}`}
          >
            RAD
          </button>
        </div>
      </div>

      {/* Keypad */}
      <div className="p-4 grid grid-cols-5 gap-2">
        {/* Row 1: Scientific */}
        <button onClick={() => handleInput("sin(")} className={funcClass}>sin</button>
        <button onClick={() => handleInput("cos(")} className={funcClass}>cos</button>
        <button onClick={() => handleInput("tan(")} className={funcClass}>tan</button>
        <button onClick={handleDelete} className={`${funcClass} col-span-2 text-destructive bg-destructive/10 hover:bg-destructive/20`}><Delete className="w-4 h-4" /></button>
        
        {/* Row 2: Scientific */}
        <button onClick={() => handleInput("ln(")} className={funcClass}>ln</button>
        <button onClick={() => handleInput("log(")} className={funcClass}>log</button>
        <button onClick={() => handleInput("sqrt(")} className={funcClass}>√</button>
        <button onClick={() => handleInput("(")} className={funcClass}>(</button>
        <button onClick={() => handleInput(")")} className={funcClass}>)</button>

        {/* Row 3: Numbers & Basic Ops */}
        <button onClick={() => handleInput("7")} className={numClass}>7</button>
        <button onClick={() => handleInput("8")} className={numClass}>8</button>
        <button onClick={() => handleInput("9")} className={numClass}>9</button>
        <button onClick={() => handleInput("/")} className={opClass}>÷</button>
        <button onClick={handleClear} className={`${opClass} !bg-destructive/10 !text-destructive hover:!bg-destructive/20`}>AC</button>

        {/* Row 4 */}
        <button onClick={() => handleInput("4")} className={numClass}>4</button>
        <button onClick={() => handleInput("5")} className={numClass}>5</button>
        <button onClick={() => handleInput("6")} className={numClass}>6</button>
        <button onClick={() => handleInput("*")} className={opClass}>×</button>
        <button onClick={() => handleInput("^")} className={opClass}>^</button>

        {/* Row 5 */}
        <button onClick={() => handleInput("1")} className={numClass}>1</button>
        <button onClick={() => handleInput("2")} className={numClass}>2</button>
        <button onClick={() => handleInput("3")} className={numClass}>3</button>
        <button onClick={() => handleInput("-")} className={opClass}>-</button>
        <button onClick={() => handleInput("pi")} className={funcClass}>π</button>

        {/* Row 6 */}
        <button onClick={() => handleInput("0")} className={numClass}>0</button>
        <button onClick={() => handleInput(".")} className={numClass}>.</button>
        <button onClick={() => handleInput("e")} className={funcClass}>e</button>
        <button onClick={() => handleInput("+")} className={opClass}>+</button>
        <button onClick={handleCalculate} className={`${opClass} !bg-primary !text-primary-foreground hover:!bg-primary/90`}>=</button>
      </div>
    </div>
  );
}
