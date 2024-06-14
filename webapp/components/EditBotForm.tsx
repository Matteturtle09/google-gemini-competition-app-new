"use client";
import React, { useState } from 'react';
import FileUpload from "@/components/FileUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BotSettings } from "@/lib/types";
import UploadedFiles from './UploadedFiles';

const EditBotForm = () => {
    // Initialize state with botSettingsTest values
    const [botSettings, setBotSettings] = useState<BotSettings>({
        name: "Acme Fridges",
        site: "coolfridges.com",
        description: "You are a good and precise assistant that works for acme fridges.",
        datasource: {
            hostedFiles: [{
                id: "1", src: "bucket.com/myfile.pdf", fileName: "file.pdf", size: "18.4 mb",
            }]
        }
    });

    // Function to handle form submission
    async function handleForm(event) {
        event.preventDefault();
        console.log(botSettings);
    }

    // Handlers for input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'datasource') {
            // Handle nested objects differently if needed
            return;
        }
        setBotSettings(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-medium">Add New Bot</h2>
            </div>
            <div className="p-6 space-y-4">
                <form onSubmit={handleForm}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="Enter your bot's name" value={botSettings.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="site">Site</Label>
                            <Input id="site" name="site" type="text" placeholder="Specify the hosting site for your bot." value={botSettings.site} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="botdesc">Bot Behaviour Description</Label>
                            <Textarea id="botdesc" name="description" placeholder="Example: You are a professional assistant..." className="min-h-[100px]" value={botSettings.description} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="botupload">Upload your bot's datasource</Label>
                            <UploadedFiles files={botSettings.datasource} />

                            <FileUpload />
                        </div>
                    </div>
                    <Button type="submit" className="mt-1.5">Submit</Button>
                </form>
            </div>
        </div>
    );
};

export default EditBotForm;
