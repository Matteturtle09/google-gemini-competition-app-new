/**
 * v0 by Vercel.
 * @see https://v0.dev/t/flwazgQrL5W
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { DataSource } from "@/lib/types"

export default function UploadedFiles({files}: {files: DataSource}) {
    return (
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <ScrollArea className="max-h-[400px] overflow-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {files.hostedFiles.map((file) => {return <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 dark:bg-primary/20 text-primary rounded-full w-10 h-10 flex items-center justify-center">
                                <FileIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm">{file.fileName}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{file.size}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20">
                            <TrashIcon className="w-5 h-5" />
                        </Button>
                    </div>})}
                </div>
            </ScrollArea>
        </div>
    )
}

function FileIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
    )
}


function TrashIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}