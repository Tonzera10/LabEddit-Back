export class HashManagerMock {
    public hash = async (plaintext: string): Promise<string> => {
        return "hash-mock"
    }

    public compare = async (plaintext: string, hash: string): Promise<boolean> => {
        switch (plaintext) {
            case "ton123":
                return hash === "hash-mock-ton"
            case "jeff123":
                return hash === "hash-mock-jeff"
            default:
                return false
        }
    }
}