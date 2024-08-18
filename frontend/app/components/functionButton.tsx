interface buttonTypes {
    label: string;
    onClick: (e: any) => void;
    disabled?: boolean;
}
export function FunctionButton({ label, onClick, disabled }: buttonTypes) {
    return (
        <button
            type="button"
            className="mt-6 w-full pl-4 px-1 py-2.5 text-white font-medium rounded-lg text-sm  bg-[#3074f4]"
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
}
