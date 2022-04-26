export const saleToInvoice = sale => {
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function toCurrency(str) {
        if (!isNumber(str)) {
            return 'NaN'
        }
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        return formatter.format(str);
        //return isNumber(str) ? `$ ${parseFloat(str).toFixed(2)}` : 'NaN'
    }

    const transactions8To10 = isNumber(sale.transactions8To10) ? sale.transactions8To10 : (!sale.transactions8To10 || sale.transactions8To10.trim() === '' ? '0' : 'NaN')
    const transactionsOpeningDay = isNumber(sale.transactionsOpeningDay) ? sale.transactionsOpeningDay : (!sale.transactionsOpeningDay || sale.transactionsOpeningDay.trim() === '' ? '0' : 'NaN')
    const transactionTotal = isNumber(sale.transactionTotal) ? sale.transactionTotal : (!sale.transactionTotal || sale.transactionTotal.trim() === '' ? '0' : 'NaN')
    const commissionRateTotal = parseFloat(`${sale.commissionRate/100 * sale.grossSalesActualClover}`)
    // const totalTrueLegacyFee = parseFloat(sale.minimumActual) + commissionRateTotal
    
    
    //const grossSalesEntireSale = parseFloat(sale.grossSalesCreditDebit || sale.grossSalesCash)

    //Gross Sales Cash + Cash Outside Clover + (Gross Sales Credit & Debit*0.965) – (Gross Sales Actual Clover*0.0775)
    const grossProceeds = parseFloat(sale.grossSalesCash) + parseFloat(sale.cashOutsideClover) +
        (parseFloat(sale.grossSalesCreditDebit) * 0.965) -
        (parseFloat(sale.grossSalesActualClover) * 0.0775);
    const grossProceedsHelp = `Gross Sales Cash + Cash Outside Clover + (Gross Sales Credit & Debit*0.965) - (Gross Sales Actual Clover*0.0775)@${sale.grossSalesCash} + ${sale.cashOutsideClover} + (${sale.grossSalesCreditDebit}*0.965) - (${sale.grossSalesActualClover}*0.0775)`

    

    //(Gross Proceeds – True Legacy Fee Minimum)*True Legacy Fee % = $
    const trueLegacyFeeMinimum = parseFloat(sale.minimumActual);
    const splitFeeFloat = parseInt(sale.splitFee) / 100;
    const trueLegacyFee = (grossProceeds - trueLegacyFeeMinimum) * splitFeeFloat
    const totalTrueLegacyFee = trueLegacyFeeMinimum + trueLegacyFee
    // const netShareToClient = parseFloat(sale.grossSalesActualClover) - totalTrueLegacyFee
    const netShareToClient = grossProceeds - totalTrueLegacyFee
    const trueLegacyFeeHelp = `(Gross Proceeds - True Legacy Fee Minimum)*True Legacy Fee %@(${grossProceeds} - ${trueLegacyFeeMinimum}) * ${splitFeeFloat}`

    const grossSales8To10 = parseFloat(sale.grossSales8To10) * 0.9;
    const grossSales8To10Help = `90% of Gross Sales Opening Day 8-10@${parseFloat(sale.grossSales8To10)} * 0.9`;
    const grossSalesOpeningDay = parseFloat(sale.grossSalesOpeningDay) * 0.9;
    const grossSalesOpeningDayHelp = `90% of Gross Sales Opening Day@${parseFloat(sale.grossSalesOpeningDay)} * 0.9`;
    const disposal = parseFloat(sale.disposalFee)
    const addlDonationLoadCost = parseFloat(sale.additionalDonationLoadCost)
    const courtesyDiscount = parseFloat(sale.courtesyDiscount)
    const otherGrossProceedsDollar = parseFloat(sale.otherGrossProceedsDollar)

    return {
        ...sale,
        transactions8To10,
        transactionsOpeningDay,
        transactionTotal,

        saleId: sale._id,
        clientEmail: sale.clientEmail.toLowerCase(),
        MailingAddress: ["clientMailingAddress1", "clientMailingAddress2", "clientMailingCity"
            , "clientMailingState", "clientPostalCode"].reduce((acc, cur) => sale[cur] && sale[cur] !== '0' ? `${acc}, ${sale[cur]}` : acc, '')
            .substring(1).trim(),
        grossProceeds: toCurrency(grossProceeds), grossProceedsHelp,
        trueLegacyFeeMinimum: toCurrency(trueLegacyFeeMinimum),
        trueLegacyFee: toCurrency(trueLegacyFee), trueLegacyFeeHelp,
        totalTrueLegacyFee: toCurrency(`${totalTrueLegacyFee}`),
        netShareToClient: toCurrency(`${netShareToClient}`),
        disposal: toCurrency(disposal),
        

        grossSales8To10: toCurrency(grossSales8To10), grossSales8To10Help,
        avePurchaseAmount8To10: toCurrency(`${grossSales8To10 / parseInt(transactions8To10)}`),

        grossSalesOpeningDay: toCurrency(grossSalesOpeningDay), grossSalesOpeningDayHelp,
        avePurchaseAmountOpeningDay: toCurrency(`${grossSalesOpeningDay / parseInt(transactionsOpeningDay)}`),

        grossSalesEntireSale: toCurrency(`${grossProceeds}`),
        avePurchaseAmountEntireSale: toCurrency(`${grossProceeds / parseInt(transactionTotal)}`),

        courtesyDiscount: toCurrency(courtesyDiscount), hasCourtesyDiscount: sale.courtesyDiscount > 0,


        otherGrossProceedsText: sale.otherGrossProceedsText, hasOtherGrossProceedsText: sale.otherGrossProceedsText && sale.otherGrossProceedsText.trim(),
        otherGrossProceedsDollar: toCurrency(otherGrossProceedsDollar), hasOtherGrossProceedsDollar: sale.otherGrossProceedsDollar > 0,
        addlDonationLoadCost: toCurrency(addlDonationLoadCost), hasaddlDonationLoadCost: sale.addlDonationLoadCost > 0,

        totalAmountDue: toCurrency(`${netShareToClient - disposal + courtesyDiscount - addlDonationLoadCost + otherGrossProceedsDollar}`)
        // totalAmountDue: toCurrency(`${addlDonationLoadCost}`)
    
    }
}