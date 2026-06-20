declare module '#auth-utils' {
    interface User {
        username: string
        email: string
    }
}

// This forces the file to be treated as a module rather than a global script
export { }