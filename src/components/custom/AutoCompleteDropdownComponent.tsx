import React, { useState } from 'react';
import { AutoComplete } from 'antd';
import { User } from "../../features/users/types";

interface OptionType {
    value: string;
    label: string;
}

interface AutoCompleteDropdownProps {
    dataSource: User[];
    defaultValue?: string; // Add this line
    placeholder?: string;
    onChange: (value: string, user: User) => void;
}

const AutoCompleteDropdownComponent: React.FC<AutoCompleteDropdownProps> = ({
                                                                                dataSource,
                                                                                defaultValue,
                                                                                placeholder,
                                                                                onChange
                                                                            }) => {    const [options, setOptions] = useState<OptionType[]>([]);
    const [displayValue, setDisplayValue] = useState("");

    const handleSearch = (value: string) => {
        const filteredOptions = dataSource
            .filter(user => user.fullName.toLowerCase().includes(value.toLowerCase()))
            .map(user => ({
                value: user.id,
                label: user.fullName
            }));

        setOptions(filteredOptions);
        setDisplayValue(value); // Allow users to type freely
    };

    const handleSelect = (value: string, option: any) => {
        const selectedUser = dataSource.find(user => user.id === value);
        if (selectedUser) {
            setDisplayValue(selectedUser.fullName); // Update the display value to the user's full name
            onChange(value, selectedUser);
        }
    };

    const handleBlur = () => {
        // Check if the displayed value matches any of the options' labels
        const isMatch = options.some(option => option.label === displayValue);
        if (!isMatch) {
            setDisplayValue(""); // Clear the input if no match is found
        }
    };

    return (
        <AutoComplete
            defaultValue={defaultValue}
            value={displayValue}
            options={options}
            onSearch={handleSearch}
            placeholder={placeholder || 'Type to search'}
            onSelect={handleSelect}
            onBlur={handleBlur}
            filterOption={(inputValue, option) =>
                option ? option.label.toLowerCase().includes(inputValue.toLowerCase()) : false
            }
            style={{ minWidth: '200px', width: 'auto' }}
        />
    );
};

export default AutoCompleteDropdownComponent;
