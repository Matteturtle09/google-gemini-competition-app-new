'use client'
import React from "react";
import signIn from "@/lib/firebase/auth/signIn";
import { useRouter } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const router = useRouter()
    const { toast } = useToast()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signIn(email, password);
        console.log(error)
        if (error) {
            
            return toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: String(error),
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })

        }

        // else successful
        console.log(result)
        return router.push("/admin")
    }
    return (


        <div className="mx-auto max-w-sm space-y-6 bg-white p-6 rounded-lg shadow-2xl z-10">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Sign In</h1>
                <p className="text-gray-500 dark:text-gray-400">Enter your email and password to access your account.</p>
            </div>
            <form onSubmit={handleForm} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="email@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input onChange={(e) => setPassword(e.target.value)} id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                    Sign In
                </Button>
                <Link href="/auth/signup" className="inline-block w-full text-center text-sm underline" prefetch={false}>
                    Don't have an account? Create a new one.
                </Link>
            </form>
        </div>
    )

}

export default Page;