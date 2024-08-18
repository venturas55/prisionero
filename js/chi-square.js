function chiSquared(a1, a2) {
    // get variables from the form
    b1 = b2 = (a1 + a2) / 2;
    var alpha = 0.05;

    //find the row totals and column totals
    var sumA = a1 + a2;
    var sumB = b1 + b2;
    var sum1 = a1 + b1;
    var sum2 = a2 + b2;

    // find the overall total
    var total = a1 + a2 + b1 + b2;

    // calculate each expected value
    var expectedA1 = (sumA * sum1) / total;
    var expectedA2 = (sumA * sum2) / total;
    var expectedB1 = (sumB * sum1) / total;
    var expectedB2 = (sumB * sum2) / total;

    // (observed - expected)**2 / expected
    var valA1 = (a1 - expectedA1) ** 2 / expectedA1;
    var valA2 = (a2 - expectedA2) ** 2 / expectedA2;
    var valB1 = (b1 - expectedB1) ** 2 / expectedB1;
    var valB2 = (b2 - expectedB2) ** 2 / expectedB2;

    // add these up to find Chi-squared statistic
    var chiSq = Math.round(1000 * (valA1 + valA2 + valB1 + valB2)) / 1000;

    // get the p-value
    var pvalue = Math.round(10000 * compute(chiSq)) / 10000;
    //var pval = pvalue.toString();
    /* if (pvalue < 0.0001) {
        pval = "< 0.0001";
    } */


return pvalue;

}

/* Math functions to calculate inverse CDF of chi squared distribution
 
adapted from: https://www.math.ucla.edu/~tom/distributions/chisq.html
 
read more: https://en.wikipedia.org/wiki/Chi-squared_distribution#Computational_methods
 
*/
function LogGamma(Z) {
    var S =
        1 +
        76.18009173 / Z -
        86.50532033 / (Z + 1) +
        24.01409822 / (Z + 2) -
        1.231739516 / (Z + 3) +
        0.00120858003 / (Z + 4) -
        0.00000536382 / (Z + 5);
    var LG =
        (Z - 0.5) * Math.log(Z + 4.5) - (Z + 4.5) + Math.log(S * 2.50662827465);

    return LG;
}

function Gcf(X, A) {
    // Good for X>A+1
    var A0 = 0;
    var B0 = 1;
    var A1 = 1;
    var B1 = X;
    var AOLD = 0;
    var N = 0;
    while (Math.abs((A1 - AOLD) / A1) > 0.00001) {
        AOLD = A1;
        N = N + 1;
        A0 = A1 + (N - A) * A0;
        B0 = B1 + (N - A) * B0;
        A1 = X * A0 + N * A1;
        B1 = X * B0 + N * B1;
        A0 = A0 / B1;
        B0 = B0 / B1;
        A1 = A1 / B1;
        B1 = 1;
    }
    var Prob = Math.exp(A * Math.log(X) - X - LogGamma(A)) * A1;

    return 1 - Prob;
}

function Gser(X, A) {
    // Good for X<A+1.
    var T9 = 1 / A;
    var G = T9;
    var I = 1;
    while (T9 > G * 0.00001) {
        T9 = (T9 * X) / (A + I);
        G = G + T9;
        I = I + 1;
    }
    G = G * Math.exp(A * Math.log(X) - X - LogGamma(A));
    return G;
}

function Gammacdf(x, a) {
    var GI;
    if (x <= 0) {
        GI = 0;
    } else if (x < a + 1) {
        GI = Gser(x, a);
    } else {
        GI = Gcf(x, a);
    }
    return GI;
}

function compute(chisq) {
    Z = chisq;
    DF = 1;
    Chisqcdf = Gammacdf(Z / 2, DF / 2);
    Chisqcdf = Math.round(Chisqcdf * 100000) / 100000;
    return 1 - Chisqcdf;
}
