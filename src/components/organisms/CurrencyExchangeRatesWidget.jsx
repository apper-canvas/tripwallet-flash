import React from 'react';
import CurrencyExchangeRateCard from '@/components/molecules/CurrencyExchangeRateCard';
import Text from '@/components/atoms/Text';

const CurrencyExchangeRatesWidget = ({ exchangeRates }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <Text as="h3" className="text-lg font-semibold text-surface-900 mb-4">Live Exchange Rates</Text>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exchangeRates.slice(0, 4).map((rate, index) => (
                    <CurrencyExchangeRateCard
                        key={`${rate.from}-${rate.to}`}
                        rate={rate}
                        animationDelay={index * 0.1}
                    />
                ))}
            </div>
        </div>
    );
};

export default CurrencyExchangeRatesWidget;