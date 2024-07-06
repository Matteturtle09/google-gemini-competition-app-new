import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <BackgroundGradientAnimation gradientBackgroundStart="rgb(134, 239, 172)" gradientBackgroundEnd="rgb(147, 51, 234)" firstColor="rgb(147, 51, 234)" secondColor="rgb(134, 239, 172)" thirdColor="rgb(147, 51, 234)">
                <div className="flex items-center justify-center h-screen">

                    <slot>    {children}
                    </slot>
                </div>
            </BackgroundGradientAnimation>
        </>
    );
}
