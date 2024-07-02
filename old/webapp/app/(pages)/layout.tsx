import AppHeader from "@/components/AppHeader";




export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AppHeader />
            <slot>    {children}
            </slot>
        </>
    );
}
