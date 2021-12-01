
class Filters {

    public static flexDecimals(value:any) {

      const formateNum = Number(value);

      let checkDecimal = 1;
      const relevantDigits = (num:number) => {
        while (checkDecimal * Math.abs(num) < 1) {
          checkDecimal = 10 * checkDecimal;
          if(checkDecimal * Math.abs(num) >= 1){
            return num.toFixed(checkDecimal.toString().length);
          }
        }
      }

      if(formateNum === 0){
        return formateNum;
      }else if (Math.abs(formateNum) >= 1000 ) {
        return Number(formateNum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        // return formateNum.toFixed(0); // 0 decimals
      }else if (Math.abs(formateNum) >= 100 ) {
        return formateNum.toFixed(0); // 0 decimals
      }else if (Math.abs(formateNum)  >= 1) {
        return formateNum.toFixed(2); // 2 decimals
      }else if (formateNum < 1 && formateNum > -1) {
        return relevantDigits(formateNum); // always 2 relevant digits after zeros
      }
  }
}

export default Filters;
