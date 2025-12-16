export default function Button({ text, icon, addDropShadow = false }: any) {
    return (
        <button
            className={`bg-yellow-500 px-4 py-2 text-neutral-900 flex items-center gap-2 rounded-[999] border ${addDropShadow ? "drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" : ""} cursor-pointer`}
        >
            <div className="w-4 h-4">{icon}</div> <span className="font-bold">{text}</span>
        </button>
    );
}
