import React, { useState } from 'react';
import { AutoComplete } from 'antd';
import { User } from "../../features/users/types";

interface OptionType {
    value: string;
    label: string;
}

interface AutoCompleteDropdownProps {
    dataSource: User[];
    defaultValue?: string;
    placeholder?: string;
    onChange: (value: string, user: User) => void;
}

const AutoCompleteDropdownComponent: React.FC<AutoCompleteDropdownProps> = ({
                                                                                dataSource,
                                                                                defaultValue,
                                                                                placeholder,
                                                                                onChange
                                                                            }) => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [displayValue, setDisplayValue] = useState("");

    const handleSearch = (value: string) => {
        const filteredOptions = dataSource
            .filter(user => user.fullName.toLowerCase().includes(value.toLowerCase()))
            .map(user => ({
                value: user.id,
                label: user.fullName
            }));

        setOptions(filteredOptions);
        setDisplayValue(value);
    };

    const handleSelect = (value: string, option: any) => {
        const selectedUser = dataSource.find(user => user.id === value);
        if (selectedUser) {
            setDisplayValue(selectedUser.fullName);
            onChange(value, selectedUser);
        }
    };

    const handleBlur = () => {
        const isMatch = options.some(option => option.label === displayValue);
        if (!isMatch) {
            setDisplayValue("");
        }
    };

    const handleFocus = () => {
        handleSearch(""); // Show all options when the component gains focus
    };

    return (
        <AutoComplete
            defaultValue={defaultValue}
            value={displayValue}
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            onBlur={handleBlur}
            onFocus={handleFocus} // Add this line
            placeholder={placeholder || 'Type to search'}
            filterOption={(inputValue, option) =>
                option ? option.label.toLowerCase().includes(inputValue.toLowerCase()) : false
            }
            style={{ minWidth: '200px', width: 'auto' }}
        />
    );
};

export default AutoCompleteDropdownComponent;
