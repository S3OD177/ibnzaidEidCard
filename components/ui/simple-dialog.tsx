import * as React from "react"
import { X } from "lucide-react"
import { Button } from "./button"

interface SimpleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    title: string;
}

export function SimpleDialog({ open, onOpenChange, children, title }: SimpleDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in-0">
            <div className="relative w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-lg animate-in zoom-in-95">
                <div className="flex flex-col space-y-1.5 text-center sm:text-right">
                    <div className="flex justify-between items-center mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                        <h2 className="text-lg font-semibold leading-none tracking-tight text-white">{title}</h2>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
