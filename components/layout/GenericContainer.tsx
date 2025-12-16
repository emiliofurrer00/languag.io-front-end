import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
    return <div className="bg-white p-10 border-t border-l border-r-4 border-b-4 rounded-[16]">{children}</div>;
}
