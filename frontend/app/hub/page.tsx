

export default function Page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">
                            Welcome to Habit Race
                        </h1>
                        <p className="text-muted-foreground/70">
                            A place to track your habits and progress
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href="/login"
                                className="btn btn-primary"
                            >
                                Login
                            </a>
                            <a
                                href="/register"
                                className="btn btn-secondary"
                            >
                                Register
                            </a>
                            <a
                                href="/forgotpassword"
                                className="btn btn-outline"
                            >
                                Forgot Password
                                </a>
                        </div>

                        
                    </div>
                </div>
            </div>

        </div>
    )
}

