import React, { useState, useEffect, forwardRef } from 'react';

export const Masks = {
    cpf: '###.###.###-##',
    cep: '#####-###',
};

const applyMask = (value, mask) => {
    const unmaskedValue = value.replace(/\D/g, '');
    let maskedValue = '';
    let i = 0;

    for (const char of mask) {
        if (char === '#') {
            if (i < unmaskedValue.length) {
                maskedValue += unmaskedValue[i];
                i++;
            }
        } else {
            if (i < unmaskedValue.length) {
                maskedValue += char;
            }
        }
    }

    return maskedValue;
};

const MaskedInput = forwardRef(({ mask, value = '', onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (isFocused) {
            setInputValue(applyMask(value, mask));
        } else {
            setInputValue(value);
        }
    }, [value, mask, isFocused]);

    const handleChange = (event) => {
        const rawValue = event.target.value;
        const maskedValue = applyMask(rawValue, mask);
        setInputValue(maskedValue);
        if (onChange) {
            onChange({ target: { value: maskedValue } });
        }
    };

    return (
        <input
            ref={ref}
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={!isFocused ? props.placeholder : ''}
            {...props}
        />
    );
});

MaskedInput.displayName = 'MaskedInput';

export default MaskedInput;
