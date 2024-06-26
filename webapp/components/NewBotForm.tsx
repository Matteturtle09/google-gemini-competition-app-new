"use client";
import FileUpload from "@/components/FileUpload"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormEvent } from "react"

const NewBotForm = () => {
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/createnewbot', {
            method: 'POST',
            body: formData,
        })

        // Handle response if necessary
        const data = await response.json()

    }

    return (<div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-medium">Add New Bot</h2>
        </div>
        <div className="p-6 space-y-4">
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Enter your bot's name" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="site">Site</Label>
                        <Input id="site" name="site" type="text" placeholder="Specify the hosting site for your bot." />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="botdesc">Bot Behaviour Description</Label>
                    <Textarea id="botdesc" name="botdesc" placeholder="Example: You are a professional assistant..." className="min-h-[100px]" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="botupload">Upload your bot's datasource</Label>
                    <FileUpload />
                </div>
                <Button className="mt-1.5">Submit</Button>
            </form>
        </div>
    </div>
    )
}

export default NewBotForm

