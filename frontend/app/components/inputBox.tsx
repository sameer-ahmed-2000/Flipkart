import { ChangeEvent } from "react";

interface InputBoxProps {
    placeholder: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function InputBox({ placeholder, onChange }: InputBoxProps) {
    return (
        <div className="py-1">
            <input
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-4 px-1 py-2.5 border rounded border-slate-200 bg-custom-gray"
            />
        </div>
    );
}
