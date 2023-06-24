window.addEventListener('load', function () {
    const generateBtn = document.querySelector('.generate');
    const generatedPassphraseField = document.querySelector('input');
    let charactersRemaining: number = 16;

    async function fetchWordList(numberOfWords: number): Promise<string[]> {
        const res = await fetch(
            `https://random-word-api.vercel.app/api?words=${numberOfWords}&type=capitalized`
        );
        const wordList: string[] = await res.json();

        return wordList;
    }

    async function getRandomWord(wordList: string[]): Promise<string> {
        const randomIndex = Math.floor(Math.random() * wordList.length - 1);

        return wordList[randomIndex];
    }

    function pruneWordList(wordList: string[]): string[] {
        const prunedWordList: string[] = [];

        for (let i = 0; i < wordList.length; i++) {
            const word = wordList[i];
            if (word.length < charactersRemaining) {
                prunedWordList.push(word);
            }
        }

        return prunedWordList;
    }

    function generateRandomNumber(): number {
        return Math.floor(Math.random() * 10);
    }

    function generateSpecialCharacter(): string {
        const specialCharacters: string = '!@#$%^&*-_=+?';
        return specialCharacters.charAt(
            Math.floor(Math.random() * specialCharacters.length)
        );
    }

    function generateNumberOrSpecialCharacter(): string {
        const randomNum: number = Math.floor(Math.random() * 2);
        return randomNum == 0
            ? generateRandomNumber().toString()
            : generateSpecialCharacter();
    }

    async function generateRandomPassphrase(): Promise<string> {
        let passphrase: string = '';
        let wordList: string[] = await fetchWordList(500);

        while (charactersRemaining > 0) {
            if (wordList.length === 0) {
                break;
            }

            const word: string = await getRandomWord(wordList);
            if (word) {
                passphrase += word;
                charactersRemaining -= word.length;
            }

            // Maximum of 3 character sequence
            const maxNumAndSpecialCharLength: number = Math.min(
                charactersRemaining,
                3
            );

            const numAndSpecialCharLength: number =
                Math.floor(Math.random() * maxNumAndSpecialCharLength) + 1;

            for (let i = 0; i < numAndSpecialCharLength; i++) {
                passphrase += generateNumberOrSpecialCharacter();
                charactersRemaining--;
            }

            wordList = pruneWordList(wordList);
        }

        return passphrase;
    }

    function passphraseIsValid(passphrase: string): boolean {
        return (
            containsNumbers(passphrase) &&
            containsSpecialCharacters(passphrase) &&
            passphrase.length >= 10 &&
            passphrase.length <= 16
        );
    }

    function containsNumbers(passphrase: string): boolean {
        return /[0-9]/.test(passphrase);
    }

    function containsSpecialCharacters(passphrase: string): boolean {
        return /[!@#$%^&*\-_=+?]/.test(passphrase);
    }

    generateBtn.addEventListener('click', async function () {
        const passphrase: string = await generateRandomPassphrase();
        generatedPassphraseField.value = passphrase;
        charactersRemaining = 16;
    });
});
