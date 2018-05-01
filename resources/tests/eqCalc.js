

let bop = 100000.0;
let amtOwed = 98000.0;
let perEquity = .92;
let fmv = ((bop*perEquity-amtOwed)) //fair market value
let threshold = bop*.08
let equity = bop-amtOwed
let qualify = threshold-equity

console.log(qualify)

